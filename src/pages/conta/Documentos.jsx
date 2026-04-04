import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api, { notyf } from '../../services/api';
import {
	FileText,
	Upload,
	CheckCircle,
	X,
	Clock,
	Loader2,
	Shield,
	AlertCircle,
	Eye,
	Camera,
	Briefcase
} from 'lucide-react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import ButtonLoader from '../../components/ButtonLoader';

const Documentos = () => {
	useDocumentTitle('Documentos - CaxiAuto');

	const { user } = useAuth();
	const [loading, setLoading] = useState(true);
	const [uploading, setUploading] = useState(false);
	const [sellerDocs, setSellerDocs] = useState(null);

	// Ficheiros por secção
	const [idCardFiles, setIdCardFiles] = useState([]);
	const [orgDocFiles, setOrgDocFiles] = useState([]);
	const [selfieFiles, setSelfieFiles] = useState([]);

	useEffect(() => {
		fetchDocuments();
	}, []);

	const fetchDocuments = async () => {
		setLoading(true);
		try {
			const profileRes = await api.getProfile();
			if (profileRes.success && profileRes.data) {
				const userData = profileRes.data;
				if (userData.sellerDocs) {
					setSellerDocs(userData.sellerDocs);
				}
			}
		} catch (error) {
			console.error('Erro ao carregar documentos:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleFileChange = (e, setFiles) => {
		const selected = Array.from(e.target.files);
		if (selected.length === 0) return;

		const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'application/pdf'];
		const invalid = selected.filter(f => !validTypes.includes(f.type));
		if (invalid.length > 0) {
			notyf.error('Apenas imagens (JPG, PNG, WEBP) e PDF são aceitos');
			return;
		}

		const maxSize = 5 * 1024 * 1024;
		const oversized = selected.filter(f => f.size > maxSize);
		if (oversized.length > 0) {
			notyf.error('Cada arquivo deve ter no máximo 5MB');
			return;
		}

		setFiles(prev => [...prev, ...selected]);
	};

	const removeFile = (index, setFiles) => {
		setFiles(prev => prev.filter((_, i) => i !== index));
	};

	const uploadToCloudinary = async (file) => {
		const signRes = await api.getCloudinarySignature('seller-docs');
		if (!signRes.success) throw new Error('Falha na assinatura de upload');

		const { timestamp, signature, cloudname, apikey, folder } = signRes;
		const formData = new FormData();
		formData.append('file', file);
		formData.append('api_key', apikey);
		formData.append('timestamp', timestamp);
		formData.append('signature', signature);
		formData.append('folder', folder);

		const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudname}/auto/upload`, {
			method: 'POST',
			body: formData
		});

		if (!res.ok) {
			const err = await res.json();
			throw new Error(err.error?.message || 'Erro no upload');
		}

		const data = await res.json();
		return data.secure_url;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (idCardFiles.length === 0 && (!sellerDocs?.idCard || sellerDocs.idCard.length === 0)) {
			notyf.error('Envie pelo menos um documento de identificação (BI ou Passaporte)');
			return;
		}

		if (selfieFiles.length === 0 && (!sellerDocs?.selfies || sellerDocs.selfies.length === 0)) {
			notyf.error('Envie pelo menos uma selfie');
			return;
		}

		setUploading(true);
		try {
			// Upload de novos ficheiros
			const uploadedIdCards = await Promise.all(idCardFiles.map(uploadToCloudinary));
			const uploadedOrgDocs = await Promise.all(orgDocFiles.map(uploadToCloudinary));
			const uploadedSelfies = await Promise.all(selfieFiles.map(uploadToCloudinary));

			// Combinar com URLs existentes (se houver)
			const finalIdCards = uploadedIdCards.length > 0 ? uploadedIdCards : (sellerDocs?.idCard || []);
			const finalOrgDocs = uploadedOrgDocs.length > 0
				? [...(sellerDocs?.organizationDocs || []), ...uploadedOrgDocs]
				: (sellerDocs?.organizationDocs || []);
			const finalSelfies = uploadedSelfies.length > 0 ? uploadedSelfies : (sellerDocs?.selfies || []);

			const res = await api.updateSellerDocs({
				idCardUrls: finalIdCards,
				organizationDocUrls: finalOrgDocs,
				selfieUrls: finalSelfies
			});

			if (res.success) {
				notyf.success(res.message);
				setIdCardFiles([]);
				setOrgDocFiles([]);
				setSelfieFiles([]);
				fetchDocuments();
			} else {
				notyf.error(res.message || 'Erro ao enviar documentos');
			}
		} catch (error) {
			console.error('Erro ao enviar documentos:', error);
			notyf.error(`Erro ao enviar: ${error.message}`);
		} finally {
			setUploading(false);
		}
	};

	const statusBadge = user?.isVerified
		? { label: 'Verificado', icon: CheckCircle, bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' }
		: { label: 'Pendente de Verificação', icon: Clock, bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' };

	const StatusIcon = statusBadge.icon;

	// Componente de preview de ficheiros locais ou existentes
	const FilePreview = ({ files, existingUrls, setFiles, label, icon: Icon }) => (
		<div>
			<label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
				<Icon className="w-4 h-4" />
				{label}
			</label>

			<div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#154c9a] transition-colors">
				<input
					type="file"
					id={`upload-${label.replace(/\s/g, '-')}`}
					multiple
					accept="image/*,application/pdf"
					onChange={(e) => handleFileChange(e, setFiles)}
					className="hidden"
				/>
				<label
					htmlFor={`upload-${label.replace(/\s/g, '-')}`}
					className="cursor-pointer flex flex-col items-center"
				>
					<Upload className="w-8 h-8 text-gray-400 mb-2" />
					<p className="text-sm font-medium text-gray-700">Clique ou arraste ficheiros</p>
					<p className="text-xs text-gray-500">JPG, PNG, WEBP ou PDF (máx. 5MB)</p>
				</label>
			</div>

			{/* Ficheiros existentes (URLs do Cloudinary) */}
			{existingUrls && existingUrls.length > 0 && (
				<div className="mt-3">
					<p className="text-xs font-medium text-gray-500 mb-2">Documentos enviados anteriormente:</p>
					<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
						{existingUrls.map((url, idx) => (
							<a
								key={idx}
								href={url}
								target="_blank"
								rel="noopener noreferrer"
								className="relative group border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
							>
								{url.includes('.pdf') ? (
									<div className="bg-gray-100 p-6 flex items-center justify-center h-24">
										<FileText className="w-8 h-8 text-gray-400" />
									</div>
								) : (
									<img src={url} alt={`Doc ${idx + 1}`} className="w-full h-24 object-cover" />
								)}
								<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
									<Eye className="w-5 h-5 text-white" />
								</div>
							</a>
						))}
					</div>
				</div>
			)}

			{/* Ficheiros novos (locais) */}
			{files.length > 0 && (
				<div className="mt-3 space-y-2">
					<p className="text-xs font-semibold text-green-600">Novos ficheiros selecionados ({files.length}):</p>
					<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
						{files.map((file, idx) => (
							<div key={idx} className="relative group border border-green-200 rounded-lg overflow-hidden">
								{file.type === 'application/pdf' ? (
									<div className="bg-green-50 p-6 flex items-center justify-center h-24">
										<FileText className="w-8 h-8 text-green-500" />
									</div>
								) : (
									<img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-24 object-cover" />
								)}
								<button
									type="button"
									onClick={() => removeFile(idx, setFiles)}
									className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
								>
									<X className="w-3 h-3" />
								</button>
								<p className="text-xs text-gray-600 p-1 truncate">{file.name}</p>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);

	if (loading) {
		return (
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<div className="flex items-center gap-3 mb-6">
					<div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />
					<div className="space-y-2">
						<div className="h-7 bg-gray-200 rounded w-56 animate-pulse" />
						<div className="h-4 bg-gray-200 rounded w-80 animate-pulse" />
					</div>
				</div>
				<div className="space-y-6">
					<div className="border-2 border-dashed border-gray-300 rounded-xl p-6">
						<div className="h-5 bg-gray-200 rounded w-48 mb-4 animate-pulse" />
						<div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
						<div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
					</div>
					<div className="border-2 border-dashed border-gray-300 rounded-xl p-6">
						<div className="h-5 bg-gray-200 rounded w-48 mb-4 animate-pulse" />
						<div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
					</div>
					<div className="border-2 border-dashed border-gray-300 rounded-xl p-6">
						<div className="h-5 bg-gray-200 rounded w-48 mb-4 animate-pulse" />
						<div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
					</div>
					<div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
				</div>
			</div>
		);
	}

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

				{/* Status */}
				<div className={`border-2 ${statusBadge.border} ${statusBadge.bg} rounded-xl p-6 mb-6`}>
					<div className="flex items-center gap-3">
						<StatusIcon className={`w-8 h-8 ${statusBadge.text}`} />
						<div>
							<h3 className={`text-lg font-bold ${statusBadge.text}`}>{statusBadge.label}</h3>
							<p className="text-sm text-gray-600 mt-1">
								{user?.isVerified
									? 'Seu perfil está verificado com o selo de confiança.'
									: 'Documentos pendentes de análise pela equipa administrativa.'}
							</p>
						</div>
					</div>
				</div>

				{/* Info */}
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
					<div className="flex items-start gap-2">
						<AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
						<div className="text-sm text-blue-700">
							<p className="font-semibold mb-2">Por que preciso enviar documentos?</p>
							<p>
								A verificação garante segurança para todos os usuários. Vendedores verificados
								recebem o selo de confiança, aumentando credibilidade e atraindo mais compradores.
							</p>
						</div>
					</div>
				</div>

				{/* Formulário */}
				<form onSubmit={handleSubmit} className="space-y-8">
					{/* BI / Passaporte */}
					<FilePreview
						files={idCardFiles}
						existingUrls={sellerDocs?.idCard}
						setFiles={setIdCardFiles}
						label="Documento de Identificação (BI ou Passaporte) *"
						icon={Shield}
					/>

					{/* Documentos da Organização */}
					<FilePreview
						files={orgDocFiles}
						existingUrls={sellerDocs?.organizationDocs}
						setFiles={setOrgDocFiles}
						label="Documentos da Empresa (NIF, Certidão de Registo Comercial) — Opcional"
						icon={Briefcase}
					/>

					{/* Selfies */}
					<FilePreview
						files={selfieFiles}
						existingUrls={sellerDocs?.selfies}
						setFiles={setSelfieFiles}
						label="Selfies do Vendedor *"
						icon={Camera}
					/>

					{/* Botão */}
					<ButtonLoader
						type="submit"
						loading={uploading}
						loadingText="Enviando Documentos..."
						variant="primary"
						size="lg"
						className="w-full"
					>
						<Upload className="w-5 h-5" />
						{sellerDocs ? 'Atualizar Documentos' : 'Enviar Documentos para Verificação'}
					</ButtonLoader>
				</form>
			</div>
		</div>
	);
};

export default Documentos;
