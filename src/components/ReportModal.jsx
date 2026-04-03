import React, { useState } from 'react';
import api, { notyf } from '../../services/api';
import {
	AlertTriangle,
	X,
	Loader2,
	CheckCircle,
	FileText,
	User,
	Car,
	Wrench
} from 'lucide-react';

const ReportModal = ({ targetType, targetId, targetName, onReportSubmitted }) => {
	const [showModal, setShowModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [reason, setReason] = useState('');
	const [description, setDescription] = useState('');
	const [success, setSuccess] = useState(false);

	const reasons = [
		{ value: 'FRAUD', label: 'Fraude/Burla' },
		{ value: 'SPAM', label: 'Conteúdo Repetido/Spam' },
		{ value: 'INAPPROPRIATE', label: 'Conteúdo Impróprio' },
		{ value: 'WRONG_CATEGORY', label: 'Categoria Errada' },
		{ value: 'SOLD_ALREADY', label: 'Já foi Vendido' },
		{ value: 'OTHER', label: 'Outro' }
	];

	const getTargetIcon = () => {
		switch (targetType) {
			case 'user':
				return User;
			case 'vehicle':
				return Car;
			case 'peca':
				return Wrench;
			default:
				return FileText;
		}
	};

	const getTargetLabel = () => {
		switch (targetType) {
			case 'user':
				return 'usuário';
			case 'vehicle':
				return 'veículo';
			case 'peca':
				return 'peça';
			default:
				return 'item';
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!reason) {
			notyf.error('Selecione o motivo da denúncia');
			return;
		}

		if (!description.trim()) {
			notyf.error('Descreva o motivo da denúncia');
			return;
		}

		setLoading(true);
		try {
			const reportData = {
				reason,
				description,
				[`${targetType}Id`]: targetId
			};

			const response = await api.createReport(
				reason,
				description,
				{ [`${targetType}Id`]: targetId }
			);

			if (response.success) {
				notyf.success('Denúncia enviada com sucesso!');
				setSuccess(true);
				setReason('');
				setDescription('');

				setTimeout(() => {
					setShowModal(false);
					setSuccess(false);
				}, 2000);

				if (onReportSubmitted) {
					onReportSubmitted(response.data);
				}
			} else {
				notyf.error(response.msg || 'Erro ao enviar denúncia');
			}
		} catch (error) {
			console.error('Erro ao enviar denúncia:', error);
			notyf.error('Erro ao enviar denúncia. Tente novamente.');
		} finally {
			setLoading(false);
		}
	};

	const handleOpenModal = () => {
		setShowModal(true);
		setSuccess(false);
	};

	const handleCloseModal = () => {
		if (!loading) {
			setShowModal(false);
			setSuccess(false);
			setReason('');
			setDescription('');
		}
	};

	const TargetIcon = getTargetIcon();

	return (
		<>
			{/* Botão de Denunciar */}
			<button
				onClick={handleOpenModal}
				className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
			>
				<AlertTriangle className="w-4 h-4" />
				Denunciar
			</button>

			{/* Modal */}
			{showModal && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
					<div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
						{/* Header */}
						<div className="flex items-center justify-between p-6 border-b border-gray-200">
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
									<AlertTriangle className="w-6 h-6 text-white" />
								</div>
								<div>
									<h2 className="text-xl font-bold text-gray-900">Denunciar {getTargetLabel()}</h2>
									<p className="text-sm text-gray-600">{targetName}</p>
								</div>
							</div>
							<button
								onClick={handleCloseModal}
								className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
								disabled={loading}
							>
								<X className="w-5 h-5 text-gray-500" />
							</button>
						</div>

						{success ? (
							/* Mensagem de Sucesso */
							<div className="p-6">
								<div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
									<CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
									<h3 className="text-lg font-bold text-green-900 mb-2">Denúncia Enviada!</h3>
									<p className="text-sm text-green-700">
										Obrigado por nos ajudar a manter a plataforma segura.
									</p>
								</div>
							</div>
						) : (
							/* Formulário */
							<form onSubmit={handleSubmit} className="p-6 space-y-6">
								{/* Motivo */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-3">
										Motivo da Denúncia *
									</label>
									<div className="space-y-2">
										{reasons.map((r) => (
											<label
												key={r.value}
												className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
													reason === r.value
														? 'border-red-500 bg-red-50'
														: 'border-gray-200 hover:border-gray-300'
												}`}
											>
												<input
													type="radio"
													name="reason"
													value={r.value}
													checked={reason === r.value}
													onChange={(e) => setReason(e.target.value)}
													className="w-4 h-4 text-red-600"
												/>
												<span className="text-sm text-gray-700">{r.label}</span>
											</label>
										))}
									</div>
								</div>

								{/* Descrição */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										<div className="flex items-center gap-2">
											<FileText className="w-4 h-4" />
											<span>Descrição Detalhada *</span>
										</div>
									</label>
									<textarea
										value={description}
										onChange={(e) => setDescription(e.target.value)}
										rows={5}
										placeholder="Descreva detalhadamente o motivo da sua denúncia..."
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
										maxLength={1000}
										required
									/>
									<p className="text-xs text-gray-500 mt-1 text-right">
										{description.length}/1000 caracteres
									</p>
								</div>

								{/* Aviso */}
								<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
									<p className="text-sm text-blue-700">
										<strong>Importante:</strong> Denúncias falsas ou maliciosas podem resultar na suspensão da sua conta.
									</p>
								</div>

								{/* Botões */}
								<div className="flex gap-3">
									<button
										type="button"
										onClick={handleCloseModal}
										disabled={loading}
										className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
									>
										Cancelar
									</button>
									<button
										type="submit"
										disabled={loading || !reason || !description.trim()}
										className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{loading ? (
											<>
												<Loader2 className="w-5 h-5 animate-spin" />
												Enviando...
											</>
										) : (
											<>
												<AlertTriangle className="w-5 h-5" />
												Enviar Denúncia
											</>
										)}
									</button>
								</div>
							</form>
						)}
					</div>
				</div>
			)}
		</>
	);
};

export default ReportModal;
