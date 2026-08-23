import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { notyf } from '../../services/api';
import api from '../../services/api';
import axios from 'axios';
import {
	Handshake,
	Plus,
	Pencil,
	Trash2,
	Loader2,
	X,
	Upload,
	Image as ImageIcon,
	Eye,
	EyeOff,
	AlertTriangle,
	Store
} from 'lucide-react';
import {
	useMyPartners,
	useCreateMyPartner,
	useUpdateMyPartner,
	useDeleteMyPartner
} from '../../hooks/queries/usePartners';

const LojaEmpresas = () => {
	const { data, isLoading } = useMyPartners({ limit: 100 });
	const partners = data?.partners || [];
	const meta = data?.meta || { maxPartners: 0, hasActivePlan: false };

	const createMutation = useCreateMyPartner();
	const updateMutation = useUpdateMyPartner();
	const deleteMutation = useDeleteMyPartner();

	const [showModal, setShowModal] = useState(false);
	const [editing, setEditing] = useState(null);
	const [submitting, setSubmitting] = useState(false);
	const [newCharacteristic, setNewCharacteristic] = useState('');

	const [formData, setFormData] = useState({
		name: '',
		phone: '',
		whatsapp: '',
		logo: '',
		banner: '',
		characteristics: [],
		status: 'ACTIVE'
	});

	// Upload states
	const [logoFile, setLogoFile] = useState(null);
	const [logoPreview, setLogoPreview] = useState('');
	const [bannerFile, setBannerFile] = useState(null);
	const [bannerPreview, setBannerPreview] = useState('');

	const canAdd = meta.hasActivePlan && partners.length < meta.maxPartners;

	const uploadToCloudinary = async (file, folder) => {
		const authResponse = await api.get(`/cloudinary/authorize-upload?folder=${folder}`);
		if (!authResponse.success) throw new Error('Falha ao autorizar upload');

		const { timestamp, signature, cloudname, apikey } = authResponse;

		const formDataUpload = new FormData();
		formDataUpload.append('file', file);
		formDataUpload.append('api_key', apikey);
		formDataUpload.append('timestamp', timestamp);
		formDataUpload.append('signature', signature);
		formDataUpload.append('folder', folder);

		const { data: uploadData } = await axios.post(`https://api.cloudinary.com/v1_1/${cloudname}/auto/upload`, formDataUpload);
		return uploadData.secure_url;
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

	const resetForm = () => {
		setFormData({ name: '', phone: '', whatsapp: '', logo: '', banner: '', characteristics: [], status: 'ACTIVE' });
		setNewCharacteristic('');
		setLogoFile(null);
		setLogoPreview('');
		setBannerFile(null);
		setBannerPreview('');
	};

	const openNew = () => {
		setEditing(null);
		resetForm();
		setShowModal(true);
	};

	const openEdit = (partner) => {
		setEditing(partner);
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

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			let logoUrl = formData.logo;
			let bannerUrl = formData.banner;

			if (logoFile) {
				logoUrl = await uploadToCloudinary(logoFile, 'partners');
			} else if (!editing) {
				notyf.error('Selecione uma logo para a empresa');
				setSubmitting(false);
				return;
			}

			if (bannerFile) {
				bannerUrl = await uploadToCloudinary(bannerFile, 'partners');
			}

			const dataToSend = {
				...formData,
				logo: logoUrl,
				banner: bannerUrl
			};

			let response;
			if (editing) {
				response = await updateMutation.mutateAsync({ id: editing.id, data: dataToSend });
			} else {
				response = await createMutation.mutateAsync(dataToSend);
			}

			if (response.success) {
				notyf.success(editing ? 'Empresa atualizada com sucesso!' : 'Empresa criada com sucesso!');
				setShowModal(false);
				resetForm();
			} else {
				notyf.error(response.message || 'Erro ao salvar empresa');
			}
		} catch (error) {
			notyf.error(error?.response?.data?.message || error.message || 'Erro ao salvar empresa');
		} finally {
			setSubmitting(false);
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm('Tem certeza que deseja eliminar esta empresa?')) return;
		try {
			const response = await deleteMutation.mutateAsync(id);
			if (response.success) notyf.success('Empresa eliminada!');
			else notyf.error(response.message || 'Erro ao eliminar empresa');
		} catch {
			notyf.error('Erro ao eliminar empresa');
		}
	};

	const handleToggleStatus = async (partner) => {
		const newStatus = partner.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
		try {
			const response = await updateMutation.mutateAsync({ id: partner.id, data: { status: newStatus } });
			if (response.success) {
				notyf.success(`Empresa ${newStatus === 'ACTIVE' ? 'ativada' : 'desativada'}!`);
			} else {
				notyf.error(response.message || 'Erro ao alterar status');
			}
		} catch {
			notyf.error('Erro ao alterar status');
		}
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
			<div className="flex items-center justify-between flex-wrap gap-4">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Empresas</h1>
					<p className="text-gray-600 mt-1">
						{meta.hasActivePlan
							? `${partners.length} de ${meta.maxPartners} empresas utilizadas`
							: 'Subscreva um plano da secção Empresas para listar a sua empresa'}
					</p>
				</div>
				<button
					onClick={openNew}
					disabled={!canAdd}
					className="bg-[#154c9a] text-white px-4 py-2 rounded-lg hover:bg-[#123f80] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<Plus className="w-5 h-5" /> Nova Empresa
				</button>
			</div>

			{!meta.hasActivePlan && (
				<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 flex items-start gap-3">
					<AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
					<div className="flex-1">
						<p className="font-semibold text-gray-900">Sem plano da secção Empresas</p>
						<p className="text-sm text-gray-600">
							A sua empresa só é listada publicamente enquanto a assinatura da secção Empresas estiver ativa e válida.
							Subscreva um plano para começar.
						</p>
						<Link
							to="/minha-loja/assinatura"
							className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 bg-amber-600 text-white text-sm font-semibold rounded-lg hover:bg-amber-700 transition-colors"
						>
							Escolher plano
						</Link>
					</div>
				</div>
			)}

			<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
				{isLoading ? (
					<div className="flex items-center justify-center py-20">
						<Loader2 className="w-12 h-12 text-[#154c9a] animate-spin" />
					</div>
				) : partners.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20">
						<Store className="w-16 h-16 text-gray-300 mb-4" />
						<p className="text-gray-500">Nenhuma empresa encontrada</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Logo</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">WhatsApp</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
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
											<div className="flex items-center justify-end gap-2">
												<button
													onClick={() => handleToggleStatus(partner)}
													className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
													title={partner.status === 'ACTIVE' ? 'Desativar' : 'Ativar'}
												>
													{partner.status === 'ACTIVE' ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
												</button>
												<button
													onClick={() => openEdit(partner)}
													className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
													title="Editar"
												>
													<Pencil className="w-4 h-4" />
												</button>
												<button
													onClick={() => handleDelete(partner.id)}
													className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
													title="Eliminar"
												>
													<Trash2 className="w-4 h-4" />
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{showModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
						<div className="p-6">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-xl font-bold">{editing ? 'Editar' : 'Nova'} Empresa</h2>
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
											onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCharacteristic())}
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

								<div className="flex gap-3 pt-4">
									<button
										type="submit"
										disabled={submitting}
										className="flex-1 bg-[#154c9a] text-white px-4 py-2 rounded-lg hover:bg-[#123f80] disabled:opacity-50 flex items-center justify-center gap-2"
									>
										{submitting ? (
											<>
												<Loader2 className="w-4 h-4 animate-spin" />
												A enviar...
											</>
										) : (
											editing ? 'Atualizar' : 'Criar'
										)}
									</button>
									<button
										type="button"
										onClick={() => setShowModal(false)}
										disabled={submitting}
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

export default LojaEmpresas;