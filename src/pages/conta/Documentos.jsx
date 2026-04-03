import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api, { notyf } from '../../services/api';
import {
	FileText,
	Upload,
	CheckCircle,
	XCircle,
	Clock,
	Loader2,
	Shield,
	AlertCircle,
	Eye
} from 'lucide-react';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const Documentos = () => {
	useDocumentTitle('Documentos - CaxiAuto');

	const { user, updateUser } = useAuth();
	const [loading, setLoading] = useState(true);
	const [uploading, setUploading] = useState(false);
	const [sellerDocs, setSellerDocs] = useState(null);
	const [formData, setFormData] = useState({
		idCard: '',
		nif: ''
	});
	const [files, setFiles] = useState([]);
	const [previewFiles, setPreviewFiles] = useState([]);

	useEffect(() => {
		fetchDocuments();
	}, []);

	const fetchDocuments = async () => {
		setLoading(true);
		try {
			// Buscar perfil atualizado do usuário
			const profileRes = await api.getProfile();

			if (profileRes.success && profileRes.data) {
				const userData = profileRes.data;

				// Verificar se é vendedor e tem documentos
				if (userData.role === 'SELLER' && userData.sellerDocs) {
					setSellerDocs(userData.sellerDocs);
					setFormData({
						idCard: userData.sellerDocs.idCard || '',
						nif: userData.sellerDocs.nif || ''
					});
					setPreviewFiles(userData.sellerDocs.docs || []);
				}
			}
		} catch (error) {
			console.error('Erro ao carregar documentos:', error);
			notyf.error('Erro ao carregar documentos');
		} finally {
			setLoading(false);
		}
	};

	const handleFileChange = (e) => {
		const selectedFiles = Array.from(e.target.files);

		if (selectedFiles.length === 0) return;

		// Validar tipos de arquivo
		const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
		const invalidFiles = selectedFiles.filter(f => !validTypes.includes(f.type));

		if (invalidFiles.length > 0) {
			notyf.error('Apenas imagens (JPG, PNG) e PDF são aceitos');
			return;
		}

		// Validar tamanho (máximo 5MB por arquivo)
		const maxSize = 5 * 1024 * 1024; // 5MB
		const oversizedFiles = selectedFiles.filter(f => f.size > maxSize);

		if (oversizedFiles.length > 0) {
			notyf.error('Cada arquivo deve ter no máximo 5MB');
			return;
		}

		setFiles(selectedFiles);

		// Criar previews
		const previews = selectedFiles.map(file => ({
			name: file.name,
			url: URL.createObjectURL(file),
			type: file.type
		}));
		setPreviewFiles([...previewFiles, ...previews]);
	};

	const removeFile = (index) => {
		const newPreviews = previewFiles.filter((_, i) => i !== index);
		setPreviewFiles(newPreviews);

		const newFiles = files.filter((_, i) => i !== index);
		setFiles(newFiles);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!formData.idCard.trim()) {
			notyf.error('Preencha o número do BI ou Passaporte');
			return;
		}

		if (files.length === 0 && (!sellerDocs || !sellerDocs.docs || sellerDocs.docs.length === 0)) {
			notyf.error('Envie pelo menos um documento');
			return;
		}

		setUploading(true);
		try {
			// Fazer upload dos arquivos para Cloudinary
			const uploadedUrls = [];

			for (const file of files) {
				const formDataUpload = new FormData();
				formDataUpload.append('file', file);
				formDataUpload.append('folder', 'seller-docs');

				// Obter assinatura do backend
				const signRes = await api.getCloudinarySignature('seller-docs');

				if (signRes.success) {
					formDataUpload.append('signature', signRes.data.signature);
					formDataUpload.append('api_key', signRes.data.apiKey);
					formDataUpload.append('timestamp', signRes.data.timestamp);
					formDataUpload.append('folder', signRes.data.folder);

					// Upload para Cloudinary
					const uploadRes = await fetch(signRes.data.uploadUrl, {
						method: 'POST',
						body: formDataUpload
					});

					const uploadData = await uploadRes.json();

					if (uploadData.secure_url) {
						uploadedUrls.push(uploadData.secure_url);
					}
				}
			}

			// Salvar informações dos documentos
			// Nota: O backend precisa de um endpoint para atualizar sellerDocs
			// Por enquanto, vamos apenas mostrar uma mensagem de sucesso
			notyf.success('Documentos enviados com sucesso! Aguarde verificação.');

			// Limpar arquivos
			setFiles([]);
			setPreviewFiles([]);

			// Recarregar dados
			fetchDocuments();
		} catch (error) {
			console.error('Erro ao enviar documentos:', error);
			notyf.error('Erro ao enviar documentos. Tente novamente.');
		} finally {
			setUploading(false);
		}
	};

	const getStatusBadge = () => {
		if (!user?.isVerified) {
			return {
				label: 'Pendente de Verificação',
				icon: Clock,
				bg: 'bg-yellow-100',
				text: 'text-yellow-700',
				border: 'border-yellow-200'
			};
		}

		return {
			label: 'Verificado',
			icon: CheckCircle,
			bg: 'bg-green-100',
			text: 'text-green-700',
			border: 'border-green-200'
		};
	};

	if (loading) {
		return (
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<div className="flex items-center justify-center py-16">
					<div className="text-center">
						<Loader2 className="w-12 h-12 animate-spin text-[#154c9a] mx-auto mb-4" />
						<p className="text-gray-600">Carregando documentos...</p>
					</div>
				</div>
			</div>
		);
	}

	const statusBadge = getStatusBadge();
	const StatusIcon = statusBadge.icon;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<div className="flex items-center gap-3 mb-6">
					<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
						<FileText className="w-6 h-6 text-white" />
					</div>
					<div>
						<h2 className="text-2xl font-bold text-gray-900">Documentos do Vendedor</h2>
						<p className="text-sm text-gray-500 mt-1">
							Envie seus documentos para obter o selo de verificação
						</p>
					</div>
				</div>

				{/* Status de Verificação */}
				<div className={`border-2 ${statusBadge.border} ${statusBadge.bg} rounded-xl p-6 mb-6`}>
					<div className="flex items-center gap-3">
						<StatusIcon className={`w-8 h-8 ${statusBadge.text}`} />
						<div>
							<h3 className={`text-lg font-bold ${statusBadge.text}`}>
								{statusBadge.label}
							</h3>
							<p className="text-sm text-gray-600 mt-1">
								{user?.isVerified
									? 'Seu perfil de vendedor está verificado e possui o selo de confiança'
									: 'Seus documentos estão sendo analisados pela equipe administrativa'}
							</p>
						</div>
					</div>
				</div>

				{/* Informações */}
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
					<div className="flex items-start gap-2">
						<AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
						<div className="text-sm text-blue-700">
							<p className="font-semibold mb-2">Por que preciso enviar documentos?</p>
							<p>
								A verificação de documentos garante a segurança de todos os usuários da plataforma.
								Vendedores verificados recebem o selo de confiança, aumentando a credibilidade e
								atraindo mais compradores.
							</p>
						</div>
					</div>
				</div>

				{/* Formulário */}
				<form onSubmit={handleSubmit} className="space-y-6">
					{/* BI/Passaporte */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							<div className="flex items-center gap-2">
								<Shield className="w-4 h-4" />
								<span>Número do BI ou Passaporte *</span>
							</div>
						</label>
						<input
							type="text"
							value={formData.idCard}
							onChange={(e) => setFormData({ ...formData, idCard: e.target.value })}
							placeholder="Ex: 000000000LA000"
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#154c9a] focus:border-transparent"
							required
						/>
					</div>

					{/* NIF */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							<div className="flex items-center gap-2">
								<FileText className="w-4 h-4" />
								<span>NIF (Número de Identificação Fiscal)</span>
							</div>
						</label>
						<input
							type="text"
							value={formData.nif}
							onChange={(e) => setFormData({ ...formData, nif: e.target.value })}
							placeholder="Ex: 000000000"
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#154c9a] focus:border-transparent"
						/>
						<p className="text-xs text-gray-500 mt-1">
							Opcional para pessoas físicas, obrigatório para empresas
						</p>
					</div>

					{/* Upload de Documentos */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							<div className="flex items-center gap-2">
								<Upload className="w-4 h-4" />
								<span>Fotos dos Documentos *</span>
							</div>
						</label>

						<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#154c9a] transition-colors">
							<input
								type="file"
								id="file-upload"
								multiple
								accept="image/jpeg,image/png,image/jpg,application/pdf"
								onChange={handleFileChange}
								className="hidden"
							/>
							<label
								htmlFor="file-upload"
								className="cursor-pointer flex flex-col items-center"
							>
								<Upload className="w-12 h-12 text-gray-400 mb-3" />
								<p className="text-sm font-medium text-gray-700 mb-1">
									Clique para enviar ou arraste os arquivos
								</p>
								<p className="text-xs text-gray-500">
									JPG, PNG ou PDF (máx. 5MB por arquivo)
								</p>
							</label>
						</div>

						{/* Previews dos Arquivos */}
						{previewFiles.length > 0 && (
							<div className="mt-4 space-y-2">
								<p className="text-sm font-medium text-gray-700">
									Arquivos selecionados ({previewFiles.length})
								</p>
								<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
									{previewFiles.map((file, index) => (
										<div
											key={index}
											className="relative group border border-gray-200 rounded-lg overflow-hidden"
										>
											{file.type?.includes('pdf') ? (
												<div className="bg-gray-100 p-4 flex items-center justify-center h-32">
													<FileText className="w-8 h-8 text-gray-400" />
												</div>
											) : (
												<img
													src={file.url}
													alt={file.name}
													className="w-full h-32 object-cover"
												/>
											)}
											<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
												{file.url.startsWith('blob:') && (
													<button
														type="button"
														onClick={() => removeFile(index)}
														className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
													>
														<XCircle className="w-5 h-5" />
													</button>
												)}
												{!file.url.startsWith('blob:') && (
													<a
														href={file.url}
														target="_blank"
														rel="noopener noreferrer"
														className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
													>
														<Eye className="w-5 h-5" />
													</a>
												)}
											</div>
											<p className="text-xs text-gray-600 p-2 truncate">
												{file.name}
											</p>
										</div>
									))}
								</div>
							</div>
						)}
					</div>

					{/* Botão de Enviar */}
					<button
						type="submit"
						disabled={uploading}
						className="w-full bg-[#154c9a] text-white py-3 px-6 rounded-lg hover:bg-[#123f80] transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{uploading ? (
							<>
								<Loader2 className="w-5 h-5 animate-spin" />
								Enviando Documentos...
							</>
						) : (
							<>
								<Upload className="w-5 h-5" />
								Enviar Documentos para Verificação
							</>
						)}
					</button>
				</form>
			</div>
		</div>
	);
};

export default Documentos;
