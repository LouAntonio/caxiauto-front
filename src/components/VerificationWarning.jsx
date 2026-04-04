import React from 'react';
import { Shield, AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Componente de alerta de verificação para usuários não verificados
 * @param {Object} props
 * @param {string} props.variant - 'banner' | 'inline' | 'compact' (default: 'banner')
 * @param {string} props.className - Classes CSS adicionais
 */
const VerificationWarning = ({ variant = 'banner', className = '' }) => {
	const navigate = useNavigate();

	const baseClasses = 'rounded-xl border';

	if (variant === 'compact') {
		return (
			<div className={`flex items-center gap-3 bg-yellow-50 border-yellow-200 p-4 ${baseClasses} ${className}`}>
				<Shield className="w-5 h-5 text-yellow-600 flex-shrink-0" />
				<p className="text-sm text-yellow-800 font-medium flex-1">
					Conta não verificada. Envie seus documentos para desbloquear todas as funcionalidades.
				</p>
				<button
					onClick={() => navigate('/minha-conta/documentos')}
					className="inline-flex items-center gap-1 text-sm font-semibold text-[#154c9a] hover:text-[#0f3d7a] whitespace-nowrap"
				>
					Enviar Documentos
					<ArrowRight className="w-4 h-4" />
				</button>
			</div>
		);
	}

	if (variant === 'inline') {
		return (
			<div className={`bg-gradient-to-r from-yellow-50 to-amber-50/50 border-2 border-yellow-300 p-6 ${baseClasses} ${className}`}>
				<div className="flex items-start gap-4">
					<div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
						<AlertCircle className="w-6 h-6 text-yellow-700" />
					</div>
					<div className="flex-1">
						<h3 className="text-lg font-bold text-yellow-900 mb-1">Verificação Pendente</h3>
						<p className="text-yellow-800 mb-3">
							Para adicionar novos veículos e peças, você precisa passar pelo processo de verificação enviando seus documentos.
						</p>
						<button
							onClick={() => navigate('/minha-conta/documentos')}
							className="inline-flex items-center gap-2 bg-[#154c9a] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#0f3d7a] transition-colors shadow-sm"
						>
							<Shield className="w-4 h-4" />
							Enviar Documentos Agora
							<ArrowRight className="w-4 h-4" />
						</button>
					</div>
				</div>
			</div>
		);
	}

	// Variant 'banner' (default)
	return (
		<div className={`bg-gradient-to-r from-red-50 via-red-50/80 to-orange-50/50 border-2 border-red-200 p-8 ${baseClasses} shadow-sm ${className}`}>
			<div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
				<div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
					<Shield className="w-8 h-8 text-red-600" />
				</div>
				<div className="flex-1">
					<h3 className="text-xl font-bold text-red-900 mb-2">Conta Não Verificada</h3>
					<p className="text-red-800 leading-relaxed">
						Para adicionar novos veículos e peças à plataforma, você precisa passar pelo processo de verificação.
						Envie seus documentos para que nossa equipe possa validar sua conta.
					</p>
				</div>
				<button
					onClick={() => navigate('/minha-conta/documentos')}
					className="inline-flex items-center gap-2 bg-[#d41120] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#b50e1a] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 whitespace-nowrap"
				>
					<Shield className="w-5 h-5" />
					Enviar Documentos
					<ArrowRight className="w-5 h-5" />
				</button>
			</div>
		</div>
	);
};

export default VerificationWarning;
