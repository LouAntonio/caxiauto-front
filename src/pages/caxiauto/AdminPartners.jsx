import React, { useState, useEffect } from 'react';
import api, { notyf } from '../../services/api';
import { handleAdminAuthError } from '../../utils/adminUtils';
import { Users, Search, Edit2, Trash2, Loader2, Plus, Eye, EyeOff, X, Upload, Image as ImageIcon } from 'lucide-react';

const AdminPartners = () => {
	const [loading, setLoading] = useState(true);
	const [partners, setPartners] = useState([]);
	const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 });
	const [search, setSearch] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [editingPartner, setEditingPartner] = useState(null);
	const [formData, setFormData] = useState({
		name: '',
		phone: '',
		whatsapp: '',
		logo: '',
		banner: '',
		characteristics: [],
		status: 'ACTIVE'
	});
	const [newCharacteristic, setNewCharacteristic] = useState('');

	// Upload states
	const [logoFile, setLogoFile] = useState(null);
	const [logoPreview, setLogoPreview] = useState('');
	const [bannerFile, setBannerFile] = useState(null);
	const [bannerPreview, setBannerPreview] = useState('');
	const [uploading, setUploading] = useState(false);

	const uploadToCloudinary = async (file, folder) => {
		const authResponse = await api.get(`/cloudinary/authorize-upload?folder=${folder}`, {}, true);
		if (!authResponse.success) throw new Error('Falha ao autorizar upload');

		const { timestamp, signature, cloudname, apikey } = authResponse;

		const formDataUpload = new FormData();
		formDataUpload.append('file', file);
		formDataUpload.append('api_key', apikey);
		formDataUpload.append('timestamp', timestamp);
		formDataUpload.append('signature', signature);
		formDataUpload.append('folder', folder);

		const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudname}/auto/upload`, {
			method: 'POST',
			body: formDataUpload
		});

		if (!uploadResponse.ok) {
			const errorData = await uploadResponse.json();
			throw new Error(errorData.error?.message || 'Erro no upload para Cloudinary');
		}

		const data = await uploadResponse.json();
		return data.secure_url;
	};

	const handleFileChange = (type, file) => {
		if (type === 'logo') {
			setLogoFile(file);
			if (file) {
				const reader = new FileReader();
				reader.onloadend = () => setLogoPreview(reader.result);
				reader.readAsDataURL(file);
			} else {
				setLogoPreview('');
			}
		} else if (type === 'banner') {
			setBannerFile(file);
			if (file) {
				const reader = new FileReader();
				reader.onloadend = () => setBannerPreview(reader.result);
				reader.readAsDataURL(file);
			} else {
				setBannerPreview('');
			}
		}
	};

	const loadPartners = async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams({ page: pagination.currentPage, limit: 20 });
			if (search) params.append('search', search);
			const response = await api.listPartners(Object.fromEntries(params));
			if (response.success) {
				setPartners(response.data);
				setPagination({
					currentPage: response.pagination.currentPage,
					totalPages: response.pagination.totalPages,
					total: response.pagination.totalItems,
				});
			} else if (handleAdminAuthError(response)) {
				return;
			}
		} catch (error) {
			console.error('Erro ao carregar parceiros:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadPartners();
	}, [pagination.currentPage, search]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setUploading(true);
		try {
			let logoUrl = formData.logo;
			let bannerUrl = formData.banner;

			// Upload logo (obrigatório se for novo parceiro sem logo)
			if (logoFile) {
				logoUrl = await uploadToCloudinary(logoFile, 'partners');
			} else if (!editingPartner) {
				notyf.error('Selecione uma logo para o parceiro');
				setUploading(false);
				return;
			}

			// Upload banner (opcional)
			if (bannerFile) {
				bannerUrl = await uploadToCloudinary(bannerFile, 'partners');
			}

			const dataToSend = {
				...formData,
				logo: logoUrl,
				banner: bannerUrl
			};

			let response;
			if (editingPartner) {
				response = await api.updatePartner(editingPartner.id, dataToSend);
			} else {
				response = await api.createPartner(dataToSend);
			}

			if (response.success) {
				notyf.success(editingPartner ? 'Parceiro atualizado com sucesso!' : 'Parceiro criado com sucesso!');
				setShowModal(false);
				setFormData({ name: '', phone: '', whatsapp: '', logo: '', banner: '', characteristics: [], status: 'ACTIVE' });
				setEditingPartner(null);
				setNewCharacteristic('');
				setLogoFile(null);
				setLogoPreview('');
				setBannerFile(null);
				setBannerPreview('');
				loadPartners();
			} else if (handleAdminAuthError(response)) {
				return;
			} else {
				notyf.error(response.msg || 'Erro ao salvar parceiro');
			}
		} catch (error) {
			console.error('Erro ao salvar parceiro:', error);
			notyf.error(error.message || 'Erro ao salvar parceiro');
		} finally {
			setUploading(false);
		}
	};

	const handleEdit = (partner) => {
		setEditingPartner(partner);
		setFormData({
			name: partner.name,
			phone: partner.phone,
			whatsapp: partner.whatsapp,
			logo: partner.logo,
			banner: partner.banner || '',
			characteristics: partner.characteristics || [],
			status: partner.status
		});
		setLogoPreview('');
		setBannerPreview(partner.banner || '');
		setLogoFile(null);
		setBannerFile(null);
		setShowModal(true);
	};

	const handleDelete = async (id) => {
		if (!window.confirm('Tem certeza que deseja eliminar este parceiro?')) return;
		try {
			const response = await api.deletePartner(id);
			if (response.success) {
				notyf.success('Parceiro eliminado!');
				loadPartners();
			} else if (handleAdminAuthError(response)) {
				return;
			} else {
				notyf.error(response.msg || 'Erro ao eliminar parceiro');
			}
		} catch (error) {
			notyf.error('Erro ao eliminar parceiro');
		}
	};

	const handleToggleStatus = async (id, currentStatus) => {
		const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
		try {
			const response = await api.togglePartnerStatus(id, newStatus);
			if (response.success) {
				notyf.success(`Parceiro ${newStatus === 'ACTIVE' ? 'ativado' : 'desativado'}!`);
				loadPartners();
			} else if (handleAdminAuthError(response)) {
				return;
			} else {
				notyf.error(response.msg || 'Erro ao alterar status');
			}
		} catch (error) {
			notyf.error('Erro ao alterar status');
		}
	};

	const openNewPartnerModal = () => {
		setEditingPartner(null);
		setFormData({ name: '', phone: '', whatsapp: '', logo: '', banner: '', characteristics: [], status: 'ACTIVE' });
		setNewCharacteristic('');
		setLogoFile(null);
		setLogoPreview('');
		setBannerFile(null);
		setBannerPreview('');
		setShowModal(true);
	};

	const addCharacteristic = () => {
		if (newCharacteristic.trim()) {
			setFormData({ ...formData, characteristics: [...formData.characteristics, newCharacteristic.trim()] });
			setNewCharacteristic('');
		}
	};

	const removeCharacteristic = (index) => {
		setFormData({ ...formData, characteristics: formData.characteristics.filter((_, i) => i !== index) });
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Parceiros</h1>
					<p className="text-gray-600 mt-1">Gerencie os parceiros da plataforma</p>
				</div>
				<button
					onClick={openNewPartnerModal}
					className="bg-[#154c9a] text-white px-4 py-2 rounded-lg hover:bg-[#123f80] flex items-center gap-2"
				>
					<Plus className="w-5 h-5" /> Novo Parceiro
				</button>
			</div>

			<div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
				<div className="flex gap-4">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
						<input
							type="text"
							placeholder="Buscar parceiros..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a]"
						/>
					</div>
				</div>
			</div>

			<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
				{loading ? (
					<div className="flex items-center justify-center py-20">
						<Loader2 className="w-12 h-12 text-[#154c9a] animate-spin" />
					</div>
				) : partners.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20">
						<Users className="w-16 h-16 text-gray-300 mb-4" />
						<p className="text-gray-500">Nenhum parceiro encontrado</p>
					</div>
				) : (
					<table className="w-full">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Logo</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Banner</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">WhatsApp</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{partners.map((partner) => (
								<tr key={partner.id} className="hover:bg-gray-50">
									<td className="px-6 py-4">
										<img
											src={partner.logo}
											alt={partner.name}
											className="w-12 h-12 object-contain rounded"
											onError={(e) => { e.target.src = 'https://placehold.co/48x48?text=Logo'; }}
										/>
									</td>
									<td className="px-6 py-4">
										{partner.banner ? (
											<img
												src={partner.banner}
												alt={`Banner ${partner.name}`}
												className="w-20 h-10 object-cover rounded"
												onError={(e) => { e.target.src = 'https://placehold.co/80x40/e2e8f0/1e293b?text=Banner'; }}
											/>
										) : (
											<span className="text-xs text-gray-400">Sem banner</span>
										)}
									</td>
									<td className="px-6 py-4 font-medium text-gray-900">{partner.name}</td>
									<td className="px-6 py-4 text-sm text-gray-600">{partner.phone}</td>
									<td className="px-6 py-4 text-sm text-gray-600">{partner.whatsapp}</td>
									<td className="px-6 py-4">
										<span className={`px-3 py-1 rounded-full text-xs font-semibold ${
											partner.status === 'ACTIVE'
												? 'bg-green-100 text-green-800'
												: 'bg-gray-100 text-gray-800'
										}`}>
											{partner.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
										</span>
									</td>
									<td className="px-6 py-4">
										<div className="flex items-center gap-2">
											<button
												onClick={() => handleToggleStatus(partner.id, partner.status)}
												className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
												title={partner.status === 'ACTIVE' ? 'Desativar' : 'Ativar'}
											>
												{partner.status === 'ACTIVE' ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
											</button>
											<button
												onClick={() => handleEdit(partner)}
												className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
											>
												<Edit2 className="w-5 h-5" />
											</button>
											<button
												onClick={() => handleDelete(partner.id)}
												className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
											>
												<Trash2 className="w-5 h-5" />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>

			{pagination.totalPages > 1 && (
				<div className="flex items-center justify-center gap-2">
					<button
						onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
						disabled={pagination.currentPage === 1}
						className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
					>
						Anterior
					</button>
					<span className="text-sm text-gray-600">Página {pagination.currentPage} de {pagination.totalPages}</span>
					<button
						onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
						disabled={pagination.currentPage === pagination.totalPages}
						className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
					>
						Próxima
					</button>
				</div>
			)}

			{/* Modal */}
			{showModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
						<div className="p-6">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-xl font-bold">
									{editingPartner ? 'Editar' : 'Novo'} Parceiro
								</h2>
								<button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
									<X className="w-6 h-6" />
								</button>
							</div>
							<form onSubmit={handleSubmit} className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
									<input
										type="text"
										value={formData.name}
										onChange={(e) => setFormData({ ...formData, name: e.target.value })}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a]"
										required
									/>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">Telefone *</label>
										<input
											type="text"
											value={formData.phone}
											onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
											className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a]"
											required
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp *</label>
										<input
											type="text"
											value={formData.whatsapp}
											onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
											className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a]"
											required
										/>
									</div>
								</div>

								{/* Upload Logo */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Logo *</label>
									<div className="flex items-center gap-4">
										<div className="flex-1">
											<label className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#154c9a] transition-colors">
												<Upload className="w-5 h-5 text-gray-400" />
												<span className="text-sm text-gray-500">Selecionar logo</span>
												<input
													type="file"
													accept="image/*"
													onChange={(e) => handleFileChange('logo', e.target.files[0])}
													className="hidden"
												/>
											</label>
										</div>
										{(logoPreview || formData.logo) && (
											<div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
												<img
													src={logoPreview || formData.logo}
													alt="Logo preview"
													className="w-full h-full object-contain"
													onError={(e) => { e.target.src = 'https://placehold.co/64x64?text=Logo'; }}
												/>
											</div>
										)}
									</div>
								</div>

								{/* Upload Banner */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Banner (opcional)</label>
									<div className="flex items-center gap-4">
										<div className="flex-1">
											<label className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#154c9a] transition-colors">
												<ImageIcon className="w-5 h-5 text-gray-400" />
												<span className="text-sm text-gray-500">Selecionar banner</span>
												<input
													type="file"
													accept="image/*"
													onChange={(e) => handleFileChange('banner', e.target.files[0])}
													className="hidden"
												/>
											</label>
										</div>
										{(bannerPreview || formData.banner) && (
											<div className="w-24 h-10 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
												<img
													src={bannerPreview || formData.banner}
													alt="Banner preview"
													className="w-full h-full object-cover"
													onError={(e) => { e.target.src = 'https://placehold.co/96x40?text=Banner'; }}
												/>
											</div>
										)}
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Características</label>
									<div className="flex gap-2 mb-2">
										<input
											type="text"
											value={newCharacteristic}
											onChange={(e) => setNewCharacteristic(e.target.value)}
											onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCharacteristic())}
											placeholder="Adicionar característica..."
											className="flex-1 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a]"
										/>
										<button
											type="button"
											onClick={addCharacteristic}
											className="bg-[#154c9a] text-white px-4 py-2 rounded-lg hover:bg-[#123f80]"
										>
											Adicionar
										</button>
									</div>
									{formData.characteristics.length > 0 && (
										<div className="flex flex-wrap gap-2 mt-2">
											{formData.characteristics.map((char, index) => (
												<span
													key={index}
													className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
												>
													{char}
													<button
														type="button"
														onClick={() => removeCharacteristic(index)}
														className="hover:text-blue-600"
													>
														<X className="w-4 h-4" />
													</button>
												</span>
											))}
										</div>
									)}
								</div>

								{editingPartner && (
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
										<select
											value={formData.status}
											onChange={(e) => setFormData({ ...formData, status: e.target.value })}
											className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a]"
										>
											<option value="ACTIVE">Ativo</option>
											<option value="INACTIVE">Inativo</option>
										</select>
									</div>
								)}

								<div className="flex gap-3 pt-4">
									<button
										type="submit"
										disabled={uploading}
										className="flex-1 bg-[#154c9a] text-white px-4 py-2 rounded-lg hover:bg-[#123f80] disabled:opacity-50 flex items-center justify-center gap-2"
									>
										{uploading ? (
											<>
												<Loader2 className="w-4 h-4 animate-spin" />
												A enviar...
											</>
										) : (
											editingPartner ? 'Atualizar' : 'Criar'
										)}
									</button>
									<button
										type="button"
										onClick={() => setShowModal(false)}
										disabled={uploading}
										className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 disabled:opacity-50"
									>
										Cancelar
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default AdminPartners;
