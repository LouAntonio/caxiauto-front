import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
	Car,
	Plus,
	Edit2,
	Trash2,
	X,
	Save,
	Calendar,
	Gauge,
	Fuel,
	Settings,
	MapPin,
	DollarSign,
	Image as ImageIcon,
	AlertCircle
} from 'lucide-react';
import useDocumentTitle from '../hooks/useDocumentTitle';

const MeusVeiculos = () => {
	useDocumentTitle('Meus Veículos - CaxiAuto');

	const { user } = useAuth();
	const navigate = useNavigate();
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
		<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
								<Car className="w-8 h-8 text-[#154c9a]" />
								Meus Veículos
							</h1>
							<p className="mt-2 text-gray-600">
								Gerencie seus veículos cadastrados
							</p>
						</div>
						<button
							onClick={() => handleOpenModal()}
							className="flex items-center gap-2 bg-[#154c9a] text-white px-6 py-3 rounded-lg hover:bg-[#123f80] transition-colors duration-200 shadow-md"
						>
							<Plus className="w-5 h-5" />
							Adicionar Veículo
						</button>
					</div>
				</div>

				{/* Mensagem de feedback */}
				{message.text && (
					<div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
						message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
					}`}>
						<AlertCircle className="w-5 h-5" />
						{message.text}
					</div>
				)}

				{/* Lista de veículos */}
				{vehicles.length === 0 ? (
					<div className="bg-white rounded-lg shadow-md p-12 text-center">
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
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{vehicles.map(vehicle => (
							<div key={vehicle.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
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
												<span>R$ {vehicle.price}</span>
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
			</div>

			{/* Modal de formulário */}
			{showModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
						<div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
							<h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
								<Car className="w-6 h-6 text-[#154c9a]" />
								{editingVehicle ? 'Editar Veículo' : 'Adicionar Novo Veículo'}
							</h2>
							<button
								onClick={handleCloseModal}
								className="text-gray-400 hover:text-gray-600 transition-colors"
							>
								<X className="w-6 h-6" />
							</button>
						</div>

						<form onSubmit={handleSubmit} className="p-6">
							{message.text && (
								<div className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
									message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
								}`}>
									<AlertCircle className="w-4 h-4" />
									{message.text}
								</div>
							)}

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{/* Marca */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Marca <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										name="brand"
										value={formData.brand}
										onChange={handleChange}
										required
										placeholder="Ex: Toyota, Ford, Volkswagen"
										className="w-full px-4 py-2 border border-gray-300 rounded-lg"
									/>
								</div>

								{/* Modelo */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Modelo <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										name="model"
										value={formData.model}
										onChange={handleChange}
										required
										placeholder="Ex: Corolla, Fiesta, Gol"
										className="w-full px-4 py-2 border border-gray-300 rounded-lg"
									/>
								</div>

								{/* Ano */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Ano <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										name="year"
										value={formData.year}
										onChange={handleChange}
										required
										placeholder="Ex: 2020"
										className="w-full px-4 py-2 border border-gray-300 rounded-lg"
									/>
								</div>

								{/* Cor */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Cor
									</label>
									<input
										type="text"
										name="color"
										value={formData.color}
										onChange={handleChange}
										placeholder="Ex: Preto, Branco, Prata"
										className="w-full px-4 py-2 border border-gray-300 rounded-lg"
									/>
								</div>

								{/* Placa */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Placa
									</label>
									<input
										type="text"
										name="plate"
										value={formData.plate}
										onChange={handleChange}
										placeholder="Ex: ABC-1234"
										className="w-full px-4 py-2 border border-gray-300 rounded-lg"
									/>
								</div>

								{/* Quilometragem */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Quilometragem (km)
									</label>
									<input
										type="number"
										name="mileage"
										value={formData.mileage}
										onChange={handleChange}
										placeholder="Ex: 50000"
										className="w-full px-4 py-2 border border-gray-300 rounded-lg"
									/>
								</div>

								{/* Combustível */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Combustível
									</label>
									<select
										name="fuel"
										value={formData.fuel}
										onChange={handleChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg"
									>
										<option value="gasolina">Gasolina</option>
										<option value="etanol">Etanol</option>
										<option value="flex">Flex</option>
										<option value="diesel">Diesel</option>
										<option value="eletrico">Elétrico</option>
										<option value="hibrido">Híbrido</option>
									</select>
								</div>

								{/* Câmbio */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Transmissão
									</label>
									<select
										name="transmission"
										value={formData.transmission}
										onChange={handleChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg"
									>
										<option value="manual">Manual</option>
										<option value="automatico">Automático</option>
										<option value="automatizado">Automatizado</option>
										<option value="cvt">CVT</option>
									</select>
								</div>

								{/* Preço */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Preço (R$)
									</label>
									<input
										type="text"
										name="price"
										value={formData.price}
										onChange={handleChange}
										placeholder="Ex: 45000"
										className="w-full px-4 py-2 border border-gray-300 rounded-lg"
									/>
								</div>

								{/* Localização */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Localização
									</label>
									<input
										type="text"
										name="location"
										value={formData.location}
										onChange={handleChange}
										placeholder="Ex: São Paulo, SP"
										className="w-full px-4 py-2 border border-gray-300 rounded-lg"
									/>
								</div>

								{/* Status */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Status
									</label>
									<select
										name="status"
										value={formData.status}
										onChange={handleChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg"
									>
										<option value="ativo">Ativo</option>
										<option value="inativo">Inativo</option>
									</select>
								</div>

								{/* URL da imagem */}
								<div className="md:col-span-2">
									<label className="block text-sm font-medium text-gray-700 mb-1">
										URL da Imagem
									</label>
									<input
										type="url"
										name="imageUrl"
										value={formData.imageUrl}
										onChange={handleChange}
										placeholder="https://exemplo.com/imagem.jpg"
										className="w-full px-4 py-2 border border-gray-300 rounded-lg"
									/>
								</div>

								{/* Descrição */}
								<div className="md:col-span-2">
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Descrição
									</label>
									<textarea
										name="description"
										value={formData.description}
										onChange={handleChange}
										rows="4"
										placeholder="Descreva as características e condições do veículo..."
										className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"
									/>
								</div>
							</div>

							{/* Botões do formulário */}
							<div className="flex gap-3 mt-6 pt-4 border-t">
								<button
									type="button"
									onClick={handleCloseModal}
									className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
								>
									Cancelar
								</button>
								<button
									type="submit"
									className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#154c9a] text-white rounded-lg hover:bg-[#123f80] transition-colors"
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

export default MeusVeiculos;
