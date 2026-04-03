import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { CreditCard, Plus, Pencil, Trash2, Loader2, X, Image as ImageIcon } from 'lucide-react';
import { notyf } from '../../services/api';
import api from '../../services/api';

const AdminPlans = () => {
	const { adminListPlans, adminCreatePlan, adminUpdatePlan, adminDeletePlan } = useAdmin();
	const [loading, setLoading] = useState(true);
	const [plans, setPlans] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [editingPlan, setEditingPlan] = useState(null);
	const [submitting, setSubmitting] = useState(false);
	const [benefitsInput, setBenefitsInput] = useState('');

	// Banner states separados
	const [bannerFile, setBannerFile] = useState(null);
	const [bannerPreview, setBannerPreview] = useState('');

	const [formData, setFormData] = useState({
		name: '',
		price: '',
		maxVehicles: '',
		maxPecas: '',
		highlightCredits: 0,
		description: '',
		benefits: [],
	});

	const uploadToCloudinary = async (file, folder) => {
		const authResponse = await api.get(`/cloudinary/authorize-upload?folder=${folder}`, {}, true);
		if (!authResponse.success) throw new Error('Falha ao autorizar upload');

		const { cloudname, timestamp, signature, apikey } = authResponse;

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

	const loadPlans = async () => {
		setLoading(true);
		try {
			const response = await adminListPlans();
			if (response.success) setPlans(response.data);
		} catch (error) {
			console.error('Erro ao carregar planos:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadPlans();
	}, []);

	const handleOpenCreate = () => {
		setEditingPlan(null);
		setFormData({ name: '', price: '', maxVehicles: '', maxPecas: '', highlightCredits: 0, description: '', benefits: [] });
		setBenefitsInput('');
		setBannerFile(null);
		setBannerPreview('');
		setShowModal(true);
	};

	const handleOpenEdit = (plan) => {
		setEditingPlan(plan);
		setFormData({
			name: plan.name,
			price: String(Number(plan.price)),
			maxVehicles: String(plan.maxVehicles),
			maxPecas: String(plan.maxPecas),
			highlightCredits: String(plan.highlightCredits),
			description: plan.description || '',
			benefits: Array.isArray(plan.benefits) ? plan.benefits : [],
		});
		setBenefitsInput('');
		setBannerFile(null);
		setBannerPreview(plan.banner || '');
		setShowModal(true);
	};

	const handleAddBenefit = () => {
		const trimmed = benefitsInput.trim();
		if (trimmed) {
			setFormData({ ...formData, benefits: [...formData.benefits, trimmed] });
			setBenefitsInput('');
		}
	};

	const handleRemoveBenefit = (index) => {
		setFormData({ ...formData, benefits: formData.benefits.filter((_, i) => i !== index) });
	};

	const handleBannerFileChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		if (!file.type.startsWith('image/')) {
			notyf.error('Selecione um ficheiro de imagem válido');
			return;
		}

		setBannerFile(file);
		const reader = new FileReader();
		reader.onloadend = () => setBannerPreview(reader.result);
		reader.readAsDataURL(file);
	};

	const handleRemoveBanner = () => {
		setBannerFile(null);
		setBannerPreview('');
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);

		try {
			let bannerUrl = bannerPreview && !bannerFile ? bannerPreview : undefined;

			if (bannerFile) {
				bannerUrl = await uploadToCloudinary(bannerFile, 'plans');
			}

			const payload = {
				name: formData.name,
				price: Number(formData.price),
				maxVehicles: Number(formData.maxVehicles),
				maxPecas: Number(formData.maxPecas),
				highlightCredits: Number(formData.highlightCredits),
				description: formData.description || undefined,
				banner: bannerUrl,
				benefits: formData.benefits,
			};

			let response;
			if (editingPlan) {
				response = await adminUpdatePlan(editingPlan.id, payload);
			} else {
				response = await adminCreatePlan(payload);
			}

			if (response.success) {
				notyf.success(editingPlan ? 'Plano atualizado com sucesso!' : 'Plano criado com sucesso!');
				setShowModal(false);
				setEditingPlan(null);
				setFormData({ name: '', price: '', maxVehicles: '', maxPecas: '', highlightCredits: 0, description: '', benefits: [] });
				setBenefitsInput('');
				setBannerFile(null);
				setBannerPreview('');
				loadPlans();
			} else {
				notyf.error(response.message || 'Erro ao salvar plano');
			}
		} catch (error) {
			notyf.error(error.message || 'Erro ao salvar plano');
		} finally {
			setSubmitting(false);
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm('Tem certeza que deseja remover este plano?')) return;

		try {
			const response = await adminDeletePlan(id);
			if (response.success) {
				notyf.success('Plano removido com sucesso!');
				loadPlans();
			} else {
				notyf.error(response.message || 'Erro ao remover plano');
			}
		} catch (error) {
			notyf.error('Erro ao remover plano');
		}
	};

	const formatCurrency = (value) => {
		return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(value);
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Planos de Assinatura</h1>
					<p className="text-gray-600 mt-1">Gerencie os planos de assinatura disponíveis</p>
				</div>
				<button
					onClick={handleOpenCreate}
					className="bg-[#154c9a] text-white px-4 py-2 rounded-lg hover:bg-[#123f80] flex items-center gap-2"
				>
					<Plus className="w-5 h-5" /> Novo Plano
				</button>
			</div>

			<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
				{loading ? (
					<div className="flex items-center justify-center py-20">
						<Loader2 className="w-12 h-12 text-[#154c9a] animate-spin" />
					</div>
				) : plans.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20">
						<CreditCard className="w-16 h-16 text-gray-300 mb-4" />
						<p className="text-gray-500">Nenhum plano encontrado</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preço</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Max. Veículos</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Max. Peças</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Créditos</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Benefícios</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{plans.map((plan) => (
									<tr key={plan.id} className="hover:bg-gray-50">
										<td className="px-6 py-4 font-medium text-gray-900">{plan.name}</td>
										<td className="px-6 py-4 text-sm text-gray-600">{formatCurrency(Number(plan.price))}</td>
										<td className="px-6 py-4 text-sm text-gray-600">{plan.maxVehicles}</td>
										<td className="px-6 py-4 text-sm text-gray-600">{plan.maxPecas}</td>
										<td className="px-6 py-4 text-sm text-gray-600">{plan.highlightCredits}</td>
										<td className="px-6 py-4 text-sm text-gray-600">
											{Array.isArray(plan.benefits) ? `${plan.benefits.length} benefício(s)` : '—'}
										</td>
										<td className="px-6 py-4 text-right">
											<div className="flex items-center justify-end gap-2">
												<button
													onClick={() => handleOpenEdit(plan)}
													className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
													title="Editar"
												>
													<Pencil className="w-4 h-4" />
												</button>
												<button
													onClick={() => handleDelete(plan.id)}
													className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
													title="Remover"
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
					<div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
						<h2 className="text-xl font-bold mb-4">
							{editingPlan ? 'Editar Plano' : 'Novo Plano'}
						</h2>
						<form onSubmit={handleSubmit}>
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Nome do Plano</label>
									<input
										type="text"
										value={formData.name}
										onChange={(e) => setFormData({ ...formData, name: e.target.value })}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a]"
										placeholder="Ex: Stand Premium"
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Preço (Kwanza)</label>
									<input
										type="number"
										step="0.01"
										min={0}
										value={formData.price}
										onChange={(e) => setFormData({ ...formData, price: e.target.value })}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a]"
										placeholder="Ex: 50000"
										required
									/>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">Máx. Veículos</label>
										<input
											type="number"
											min={0}
											value={formData.maxVehicles}
											onChange={(e) => setFormData({ ...formData, maxVehicles: e.target.value })}
											className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a]"
											placeholder="Ex: 10"
											required
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">Máx. Peças</label>
										<input
											type="number"
											min={0}
											value={formData.maxPecas}
											onChange={(e) => setFormData({ ...formData, maxPecas: e.target.value })}
											className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a]"
											placeholder="Ex: 50"
											required
										/>
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Créditos de Destaque (mensal)</label>
									<input
										type="number"
										min={0}
										value={formData.highlightCredits}
										onChange={(e) => setFormData({ ...formData, highlightCredits: e.target.value })}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a]"
										placeholder="Ex: 5"
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Descrição <span className="text-gray-400">(opcional)</span></label>
									<textarea
										value={formData.description}
										onChange={(e) => setFormData({ ...formData, description: e.target.value })}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a] resize-none"
										rows={2}
										placeholder="Descrição do plano..."
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Benefícios</label>
									<div className="flex gap-2">
										<input
											type="text"
											value={benefitsInput}
											onChange={(e) => setBenefitsInput(e.target.value)}
											onKeyDown={(e) => {
												if (e.key === 'Enter') {
													e.preventDefault();
													handleAddBenefit();
												}
											}}
											className="flex-1 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#154c9a]"
											placeholder="Digite um benefício..."
										/>
										<button
											type="button"
											onClick={handleAddBenefit}
											className="px-4 py-2 bg-[#154c9a] text-white rounded-lg hover:bg-[#123f80] flex items-center gap-1 whitespace-nowrap"
										>
											<Plus className="w-4 h-4" /> Adicionar
										</button>
									</div>
									{formData.benefits.length > 0 && (
										<div className="flex flex-wrap gap-2 mt-3">
											{formData.benefits.map((benefit, index) => (
												<span
													key={index}
													className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-full"
												>
													{benefit}
													<button
														type="button"
														onClick={() => handleRemoveBenefit(index)}
														className="text-blue-500 hover:text-blue-700"
													>
														<X className="w-3.5 h-3.5" />
													</button>
												</span>
											))}
										</div>
									)}
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Banner <span className="text-gray-400">(opcional)</span></label>
									{bannerPreview ? (
										<div className="relative rounded-lg overflow-hidden border border-gray-300">
											<img
												src={bannerPreview}
												alt="Banner do plano"
												className="w-full h-40 object-cover"
											/>
											<button
												type="button"
												onClick={handleRemoveBanner}
												className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
											>
												<X className="w-4 h-4" />
											</button>
										</div>
									) : (
										<label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
											<ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
											<span className="text-sm text-gray-500">Selecionar banner</span>
											<input
												type="file"
												accept="image/*"
												onChange={handleBannerFileChange}
												className="hidden"
											/>
										</label>
									)}
								</div>
							</div>
							<div className="flex gap-3 mt-6">
								<button
									type="submit"
									disabled={submitting}
									className="flex-1 bg-[#154c9a] text-white px-4 py-2 rounded-lg hover:bg-[#123f80] disabled:opacity-50 flex items-center justify-center gap-2"
								>
									{submitting ? (
										<>
											<Loader2 className="w-4 h-4 animate-spin" /> A processar...
										</>
									) : (
										editingPlan ? 'Salvar' : 'Criar'
									)}
								</button>
								<button
									type="button"
									onClick={() => setShowModal(false)}
									className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
								>
									Cancelar
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default AdminPlans;
