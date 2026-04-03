import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
	Wrench,
	Plus,
	Edit2,
	Trash2,
	X,
	MapPin,
	DollarSign,
	AlertCircle,
	Upload,
	Tag,
	Package,
	Save,
	Power,
	Eye,
	EyeOff,
	ChevronLeft,
	ChevronRight
} from 'lucide-react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import api, { getImageUrl } from '../../services/api';

const Pecas = () => {
	useDocumentTitle('Minhas Peças - CaxiAuto');

	const { user } = useAuth();
	const [pecas, setPecas] = useState([]);
	const [categorias, setCategorias] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [editingPeca, setEditingPeca] = useState(null);
	const [message, setMessage] = useState({ type: '', text: '' });
	const [loading, setLoading] = useState(false);
	const [mediaFiles, setMediaFiles] = useState([]);
	const [galleryFiles, setGalleryFiles] = useState([]);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [confirmAction, setConfirmAction] = useState(null);
	const [confirmMessage, setConfirmMessage] = useState('');
	const [confirmTitle, setConfirmTitle] = useState('');
	const [confirmType, setConfirmType] = useState('danger');
	const [newCompatibility, setNewCompatibility] = useState('');
	const [currentImageIndex, setCurrentImageIndex] = useState({});
	const [formData, setFormData] = useState({
		name: '',
		categoryId: '',
		price: '',
		provincia: '',
		compatibility: [],
		condition: 'NEW'
	});

	const provincias = [
		'LUANDA', 'BENGUELA', 'HUAMBO', 'HUILA', 'CABINDA', 'NAMIBE',
		'BENGO', 'CUANZA_NORTE', 'CUANZA_SUL', 'CUNENE', 'BIE', 'MOXICO',
		'LUNDA_NORTE', 'LUNDA_SUL', 'UIGE', 'ZAIRE', 'CUANDO_CUBANGO', 'MALANJE'
	];

	const conditionLabels = {
		'NEW': 'Novo',
		'USED': 'Usado',
		'REFURBISHED': 'Recondicionado'
	};

	useEffect(() => {
		if (user) {
			loadPecas();
		}
		loadCategorias();
	}, [user]);

	const loadCategorias = async () => {
		try {
			const response = await api.listCategorias();
			if (response.success) {
				setCategorias(response.data);
			}
		} catch (error) {
			console.error('Erro ao carregar categorias:', error);
		}
	};

	const loadPecas = async () => {
		try {
			const response = await api.minhasPecas();
			if (response.success) {
				setPecas(response.data);
			}
		} catch (error) {
			console.error('Erro ao carregar peças:', error);
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

	const handleGalleryChange = (e) => {
		const files = Array.from(e.target.files);
		setGalleryFiles(prev => [...prev, ...files]);
	};

	const handleRemoveGalleryImage = (index) => {
		setGalleryFiles(prev => prev.filter((_, i) => i !== index));
	};

	const handleAddCompatibility = () => {
		if (newCompatibility.trim() && !formData.compatibility.includes(newCompatibility.trim())) {
			setFormData(prev => ({
				...prev,
				compatibility: [...prev.compatibility, newCompatibility.trim()]
			}));
			setNewCompatibility('');
		}
	};

	const handleRemoveCompatibility = (itemToRemove) => {
		setFormData(prev => ({
			...prev,
			compatibility: prev.compatibility.filter(c => c !== itemToRemove)
		}));
	};

	const resetForm = () => {
		setFormData({
			name: '',
			categoryId: '',
			price: '',
			provincia: '',
			compatibility: [],
			condition: 'NEW'
		});
		setMediaFiles([]);
		setGalleryFiles([]);
		setNewCompatibility('');
		setEditingPeca(null);
	};

	const handleOpenModal = (peca = null) => {
		if (peca) {
			setEditingPeca(peca);
			setFormData({
				name: peca.name || '',
				categoryId: peca.categoryId || peca.Categoria?.id || '',
				price: peca.price || '',
				provincia: peca.provincia || '',
				compatibility: peca.compatibility || [],
				condition: peca.condition || 'NEW'
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
			const authResponse = await api.get(`/cloudinary/authorize-upload?folder=${folder}`);

			if (!authResponse.success) {
				throw new Error('Falha ao autorizar upload');
			}

			const { timestamp, signature, cloudname, apikey } = authResponse;

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

		if (!formData.name || !formData.categoryId || !formData.price || !formData.provincia) {
			setMessage({ type: 'error', text: 'Por favor, preencha todos os campos obrigatórios.' });
			return;
		}

		if (mediaFiles.length === 0 && !editingPeca) {
			setMessage({ type: 'error', text: 'É necessário enviar pelo menos uma imagem da peça.' });
			return;
		}

		setLoading(true);
		setMessage({ type: 'info', text: 'Processando uploads... Por favor, aguarde.' });

		try {
			let uploadedImages = [];
			if (mediaFiles.length > 0) {
				const imageUploadPromises = mediaFiles.map(file => uploadToCloudinary(file, 'parts'));
				uploadedImages = await Promise.all(imageUploadPromises);
			}

			let uploadedGallery = [];
			if (galleryFiles.length > 0) {
				const galleryUploadPromises = galleryFiles.map(file => uploadToCloudinary(file, 'parts'));
				uploadedGallery = await Promise.all(galleryUploadPromises);
			}

			const pecaData = {
				name: formData.name,
				categoryId: formData.categoryId,
				price: parseFloat(formData.price),
				provincia: formData.provincia,
				compatibility: formData.compatibility,
				condition: formData.condition
			};

			if (uploadedImages.length > 0) {
				pecaData.image = uploadedImages[0];
			}

			if (uploadedGallery.length > 0) {
				pecaData.gallery = uploadedGallery;
			}

			let response;
			if (editingPeca) {
				response = await api.updatePeca(editingPeca.id, pecaData);
			} else {
				response = await api.createPeca(pecaData);
			}

			if (response.success) {
				const successText = editingPeca
					? response.msg || 'Peça atualizada com sucesso! Aguardando aprovação.'
					: response.msg || 'Peça cadastrada com sucesso!';
				setMessage({ type: 'success', text: successText });
				await loadPecas();
				setTimeout(() => {
					handleCloseModal();
				}, 3000);
			} else {
				setMessage({ type: 'error', text: response.message || 'Erro ao processar peça.' });
			}
		} catch (error) {
			console.error('Erro ao processar peça:', error);
			setMessage({ type: 'error', text: `Erro ao processar peça: ${error.message}` });
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = (pecaId) => {
		setConfirmTitle('Excluir Peça');
		setConfirmMessage('Tem certeza que deseja excluir esta peça? Esta ação não pode ser desfeita.');
		setConfirmType('danger');
		setConfirmAction(() => async () => {
			try {
				const response = await api.deletePeca(pecaId);
				if (response.success) {
					setMessage({ type: 'success', text: 'Peça excluída com sucesso!' });
					await loadPecas();
					setTimeout(() => setMessage({ type: '', text: '' }), 3000);
				} else {
					setMessage({ type: 'error', text: response.message || 'Erro ao excluir peça.' });
				}
			} catch (error) {
				console.error('Erro ao excluir peça:', error);
				setMessage({ type: 'error', text: 'Erro ao excluir peça.' });
			}
		});
		setShowConfirmModal(true);
	};

	const handleToggleStatus = (pecaId, currentStatus) => {
		const newStatus = currentStatus === 'ACTIVE' ? 'HIDDEN' : 'ACTIVE';
		setConfirmTitle('Alterar Visibilidade');
		setConfirmMessage(`Tem certeza que deseja tornar esta peça ${newStatus === 'ACTIVE' ? 'visível' : 'oculta'}?`);
		setConfirmType(newStatus === 'ACTIVE' ? 'success' : 'warning');
		setConfirmAction(() => async () => {
			try {
				const response = await api.togglePecaStatus(pecaId, newStatus);
				if (response.success) {
					setMessage({ type: 'success', text: response.msg || 'Visibilidade alterada com sucesso!' });
					await loadPecas();
					setTimeout(() => setMessage({ type: '', text: '' }), 3000);
				} else {
					setMessage({ type: 'error', text: response.message || 'Erro ao alterar visibilidade.' });
				}
			} catch (error) {
				console.error('Erro ao alterar visibilidade:', error);
				setMessage({ type: 'error', text: 'Erro ao alterar visibilidade da peça.' });
			}
		});
		setShowConfirmModal(true);
	};

	const formatProvincia = (provincia) => {
		return provincia ? provincia.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '';
	};

	const getAllImages = (peca) => {
		const images = [];
		if (peca.image) images.push(peca.image);
		if (peca.gallery && peca.gallery.length > 0) images.push(...peca.gallery);
		return images;
	};

	const prevImage = (pecaId) => {
		setCurrentImageIndex(prev => {
			const peca = pecas.find(p => p.id === pecaId);
			const images = getAllImages(peca);
			const current = prev[pecaId] || 0;
			const newIndex = current > 0 ? current - 1 : images.length - 1;
			return { ...prev, [pecaId]: newIndex };
		});
	};

	const nextImage = (pecaId) => {
		setCurrentImageIndex(prev => {
			const peca = pecas.find(p => p.id === pecaId);
			const images = getAllImages(peca);
			const current = prev[pecaId] || 0;
			const newIndex = current < images.length - 1 ? current + 1 : 0;
			return { ...prev, [pecaId]: newIndex };
		});
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
							<Wrench className="w-7 h-7 text-[#154c9a]" />
							Minhas Peças
						</h2>
						<p className="mt-1 text-gray-600">
							Gerencie suas peças e acessórios cadastrados
						</p>
					</div>
					<button
						onClick={() => handleOpenModal()}
						className="flex items-center gap-2 bg-[#154c9a] text-white px-6 py-3 rounded-lg hover:bg-[#123f80] transition-colors shadow-md cursor-pointer"
					>
						<Plus className="w-5 h-5" />
						Adicionar Peça
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

			{/* Lista de peças */}
			{pecas.length === 0 ? (
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
					<Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
					<h3 className="text-xl font-semibold text-gray-900 mb-2">
						Nenhuma peça cadastrada
					</h3>
					<p className="text-gray-600 mb-6">
						Comece adicionando sua primeira peça
					</p>
					<button
						onClick={() => handleOpenModal()}
						className="inline-flex items-center gap-2 bg-[#154c9a] text-white px-6 py-3 rounded-lg hover:bg-[#123f80] transition-colors cursor-pointer"
					>
						<Plus className="w-5 h-5" />
						Adicionar Peça
					</button>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{pecas.map(peca => {
						const allImages = getAllImages(peca);
						const currentIndex = currentImageIndex[peca.id] || 0;

						return (
							<div key={peca.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
								{/* Imagem da peça */}
								<div className="h-48 bg-gray-200 relative">
									{peca.image ? (
										<>
											<img
												src={getImageUrl(allImages[currentIndex])}
												alt={peca.name}
												className="w-full h-full object-cover"
											/>
											{allImages.length > 1 && (
												<>
													<button
														onClick={() => prevImage(peca.id)}
														className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
													>
														<ChevronLeft className="w-5 h-5" />
													</button>
													<button
														onClick={() => nextImage(peca.id)}
														className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
													>
														<ChevronRight className="w-5 h-5" />
													</button>
													<div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
														{allImages.map((_, idx) => (
															<div
																key={idx}
																className={`w-2 h-2 rounded-full ${idx === currentIndex ? 'bg-white' : 'bg-white/50'}`}
															/>
														))}
													</div>
												</>
											)}
										</>
									) : (
										<div className="w-full h-full flex items-center justify-center">
											<Wrench className="w-16 h-16 text-gray-400" />
										</div>
									)}

									{/* Badges */}
									<div className="absolute top-3 right-3 flex flex-col gap-2">
										<div className={`px-3 py-1 rounded-full text-xs font-semibold ${peca.isAproved ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
											}`}>
											{peca.isAproved ? 'Aprovado' : 'Pendente'}
										</div>
										<div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${peca.status === 'ACTIVE' ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'
											}`}>
											{peca.status === 'ACTIVE' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
											{peca.status === 'ACTIVE' ? 'Visível' : 'Oculto'}
										</div>
										{peca.isFeatured && (
											<div className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-400 text-gray-900">
												Destaque
											</div>
										)}
									</div>
								</div>

								{/* Informações da peça */}
								<div className="p-5">
									<h3 className="text-xl font-bold text-gray-900 mb-1">
										{peca.name}
									</h3>
									<p className="text-gray-600 mb-4 text-sm">
										{peca.Categoria?.name} • {conditionLabels[peca.condition] || peca.condition}
									</p>

									<div className="space-y-2 mb-4">
										<div className="flex items-center gap-2 text-sm font-semibold text-[#154c9a]">
											<DollarSign className="w-4 h-4" />
											<span>{Number(peca.price).toLocaleString()} Kz</span>
										</div>
										{peca.provincia && (
											<div className="flex items-center gap-2 text-sm text-gray-600">
												<MapPin className="w-4 h-4 text-[#154c9a]" />
												<span>{formatProvincia(peca.provincia)}</span>
											</div>
										)}
										{peca.compatibility && peca.compatibility.length > 0 && (
											<div className="flex items-start gap-2 text-sm text-gray-600">
												<Tag className="w-4 h-4 text-[#154c9a] mt-0.5" />
												<div className="flex flex-wrap gap-1">
													{peca.compatibility.slice(0, 2).map((item, idx) => (
														<span key={idx} className="bg-gray-100 px-2 py-0.5 rounded text-xs">
															{item}
														</span>
													))}
													{peca.compatibility.length > 2 && (
														<span className="text-xs text-gray-500">
															+{peca.compatibility.length - 2}
														</span>
													)}
												</div>
											</div>
										)}
									</div>

									{/* Botões de ação */}
									<div className="flex gap-2 pt-4 border-t">
										<button
											onClick={() => handleOpenModal(peca)}
											className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#154c9a] text-white rounded-lg hover:bg-[#123f80] transition-colors cursor-pointer"
										>
											<Edit2 className="w-4 h-4" />
											Editar
										</button>
										<button
											onClick={() => handleToggleStatus(peca.id, peca.status)}
											className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors cursor-pointer ${peca.status === 'ACTIVE'
												? 'bg-orange-500 text-white hover:bg-orange-600'
												: 'bg-green-500 text-white hover:bg-green-600'
												}`}
											title={peca.status === 'ACTIVE' ? 'Ocultar peça' : 'Tornar peça visível'}
										>
											<Power className="w-4 h-4" />
										</button>
										<button
											onClick={() => handleDelete(peca.id)}
											className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
											title="Excluir peça"
										>
											<Trash2 className="w-4 h-4" />
										</button>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}

			{/* Modal de formulário */}
			{showModal && (
				<div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						<div className="sticky top-0 bg-gradient-to-r from-[#154c9a] to-blue-600 px-8 py-6 flex items-center justify-between z-10">
							<h2 className="text-2xl font-bold text-white flex items-center gap-3">
								<div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
									<Wrench className="w-6 h-6 text-white" />
								</div>
								{editingPeca ? 'Editar Peça' : 'Adicionar Nova Peça'}
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
								{/* Nome da Peça */}
								<div className="md:col-span-2">
									<label className="block text-gray-700 font-semibold mb-2">
										Nome da Peça <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										name="name"
										value={formData.name}
										onChange={handleChange}
										required
										placeholder="Ex: Pastilha de Freio Dianteira"
										className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all"
									/>
								</div>

								{/* Categoria */}
								<div>
									<label className="block text-gray-700 font-semibold mb-2">
										Categoria <span className="text-red-500">*</span>
									</label>
									<select
										name="categoryId"
										value={formData.categoryId}
										onChange={handleChange}
										required
										className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all"
									>
										<option value="">Selecione a categoria</option>
										{categorias.map(cat => (
											<option key={cat.id} value={cat.id}>{cat.name}</option>
										))}
									</select>
								</div>

								{/* Condição */}
								<div>
									<label className="block text-gray-700 font-semibold mb-2">
										Condição <span className="text-red-500">*</span>
									</label>
									<select
										name="condition"
										value={formData.condition}
										onChange={handleChange}
										required
										className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all"
									>
										<option value="NEW">Novo</option>
										<option value="USED">Usado</option>
										<option value="REFURBISHED">Recondicionado</option>
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
										placeholder="Ex: 15000"
										min="0"
										step="0.01"
										className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all"
									/>
								</div>

								{/* Província */}
								<div>
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
										<option value="">Selecione a província</option>
										{provincias.map(uf => (
											<option key={uf} value={uf}>
												{uf.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
											</option>
										))}
									</select>
								</div>

								{/* Imagem Principal */}
								<div className="md:col-span-2">
									<label className="block text-gray-700 font-semibold mb-2">
										Imagem Principal {!editingPeca && <span className="text-red-500">*</span>}
									</label>
									<div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#154c9a] transition-colors">
										<input
											type="file"
											accept="image/*"
											onChange={handleMediaChange}
											className="hidden"
											id="peca-main-image"
										/>
										<label htmlFor="peca-main-image" className="cursor-pointer">
											<Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
											<p className="text-gray-600 font-medium">
												Clique para enviar imagem principal
											</p>
											<p className="text-sm text-gray-500 mt-1">
												{editingPeca ? 'Opcional — Enviar nova imagem substitui a atual' : 'Enviar uma imagem obrigatória'}
											</p>
										</label>
									</div>
									{mediaFiles.length > 0 && (
										<div className="mt-3 flex gap-2">
											{mediaFiles.map((file, idx) => (
												<div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
													<img
														src={URL.createObjectURL(file)}
														alt={`Preview ${idx + 1}`}
														className="w-full h-full object-cover"
													/>
												</div>
											))}
										</div>
									)}
								</div>

								{/* Galeria de Imagens */}
								<div className="md:col-span-2">
									<label className="block text-gray-700 font-semibold mb-2">
										Galeria de Imagens (opcional)
									</label>
									<div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#154c9a] transition-colors">
										<input
											type="file"
											accept="image/*"
											multiple
											onChange={handleGalleryChange}
											className="hidden"
											id="peca-gallery-images"
										/>
										<label htmlFor="peca-gallery-images" className="cursor-pointer">
											<Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
											<p className="text-gray-600 text-sm font-medium">
												Adicionar imagens à galeria
											</p>
										</label>
									</div>
									{galleryFiles.length > 0 && (
										<div className="mt-3 flex flex-wrap gap-2">
											{galleryFiles.map((file, idx) => (
												<div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 group">
													<img
														src={URL.createObjectURL(file)}
														alt={`Gallery ${idx + 1}`}
														className="w-full h-full object-cover"
													/>
													<button
														type="button"
														onClick={() => handleRemoveGalleryImage(idx)}
														className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
													>
														<X className="w-3 h-3" />
													</button>
												</div>
											))}
										</div>
									)}
								</div>

								{/* Compatibilidade */}
								<div className="md:col-span-2">
									<label className="block text-gray-700 font-semibold mb-2">
										Compatibilidade (opcional)
									</label>
									<div className="flex gap-2">
										<input
											type="text"
											value={newCompatibility}
											onChange={(e) => setNewCompatibility(e.target.value)}
											onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCompatibility())}
											placeholder="Ex: Toyota Corolla 2020"
											className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl transition-all"
										/>
										<button
											type="button"
											onClick={handleAddCompatibility}
											className="px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
										>
											<Plus className="w-5 h-5" />
										</button>
									</div>
									{formData.compatibility.length > 0 && (
										<div className="mt-3 flex flex-wrap gap-2">
											{formData.compatibility.map((item, idx) => (
												<span
													key={idx}
													className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
												>
													{item}
													<button
														type="button"
														onClick={() => handleRemoveCompatibility(item)}
														className="hover:text-blue-900"
													>
														<X className="w-3 h-3" />
													</button>
												</span>
											))}
										</div>
									)}
								</div>
							</div>

							{/* Botões de ação */}
							<div className="flex gap-3 mt-8 pt-6 border-t">
								<button
									type="button"
									onClick={handleCloseModal}
									className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
								>
									Cancelar
								</button>
								<button
									type="submit"
									disabled={loading}
									className="flex-1 px-6 py-3 bg-[#154c9a] text-white rounded-xl hover:bg-[#123f80] transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
								>
									{loading ? (
										<>
											<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
											Processando...
										</>
									) : (
										<>
											<Save className="w-5 h-5" />
											{editingPeca ? 'Salvar Alterações' : 'Cadastrar Peça'}
										</>
									)}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Modal de confirmação */}
			{showConfirmModal && (
				<div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
						<div className="flex items-center gap-3 mb-4">
							<div className={`w-12 h-12 rounded-full flex items-center justify-center ${confirmType === 'danger' ? 'bg-red-100' : confirmType === 'warning' ? 'bg-yellow-100' : 'bg-green-100'
								}`}>
								<AlertCircle className={`w-6 h-6 ${confirmType === 'danger' ? 'text-red-600' : confirmType === 'warning' ? 'text-yellow-600' : 'text-green-600'
									}`} />
							</div>
							<div>
								<h3 className="text-lg font-bold text-gray-900">{confirmTitle}</h3>
								<p className="text-sm text-gray-600">{confirmMessage}</p>
							</div>
						</div>
						<div className="flex gap-3">
							<button
								onClick={() => setShowConfirmModal(false)}
								className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
							>
								Cancelar
							</button>
							<button
								onClick={() => { confirmAction(); setShowConfirmModal(false); }}
								className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors cursor-pointer ${confirmType === 'danger' ? 'bg-red-600 hover:bg-red-700' : confirmType === 'warning' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'
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

export default Pecas;
