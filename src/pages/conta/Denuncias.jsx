import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api, { notyf } from '../../services/api';
import {
	AlertTriangle,
	Clock,
	CheckCircle,
	Search,
	FileText,
	Calendar,
	Loader2,
	User,
	Car,
	Wrench
} from 'lucide-react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { ListSkeleton } from '../../components/skeletons';

const Denuncias = () => {
	useDocumentTitle('Minhas Denúncias - CaxiAuto');

	const { user } = useAuth();
	const [loading, setLoading] = useState(true);
	const [reports, setReports] = useState([]);
	const [filter, setFilter] = useState('');
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [total, setTotal] = useState(0);
	const [isFetching, setIsFetching] = useState(false);
	const abortControllerRef = useRef(null);

	useEffect(() => {
		fetchReports();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filter, page]);

	const fetchReports = useCallback(async () => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}
		if (isFetching) return;

		const controller = new AbortController();
		abortControllerRef.current = controller;
		setIsFetching(true);
		setLoading(true);

		try {
			const params = { page, limit: 10 };
			if (filter) params.status = filter;

			const response = await api.getMyReports(params);

			if (!controller.signal.aborted) {
				if (response.success) {
					setReports(response.data || []);
					setTotal(response.pagination?.total || 0);
					setTotalPages(response.pagination?.totalPages || 1);
				} else {
					notyf.error('Erro ao carregar denúncias');
					setReports([]);
				}
			}
		} catch (error) {
			if (!controller.signal.aborted) {
				console.error('Erro ao carregar denúncias:', error);
				notyf.error('Erro ao carregar denúncias');
			}
		} finally {
			if (!controller.signal.aborted) {
				setLoading(false);
				setIsFetching(false);
			}
		}
	}, [filter, page, isFetching]);

	useEffect(() => {
		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		};
	}, []);

	const getStatusBadge = (status) => {
		const statusConfig = {
			PENDING: {
				label: 'Pendente',
				icon: Clock,
				bg: 'bg-yellow-100',
				text: 'text-yellow-700',
				border: 'border-yellow-200'
			},
			INVESTIGATING: {
				label: 'Em Investigação',
				icon: Search,
				bg: 'bg-blue-100',
				text: 'text-blue-700',
				border: 'border-blue-200'
			},
			RESOLVED: {
				label: 'Resolvida',
				icon: CheckCircle,
				bg: 'bg-green-100',
				text: 'text-green-700',
				border: 'border-green-200'
			}
		};

		const config = statusConfig[status] || statusConfig.PENDING;
		const Icon = config.icon;

		return (
			<span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text} border ${config.border}`}>
				<Icon className="w-3.5 h-3.5" />
				{config.label}
			</span>
		);
	};

	const getReasonLabel = (reason) => {
		const reasons = {
			FRAUD: 'Fraude/Burla',
			SPAM: 'Conteúdo Repetido/Spam',
			INAPPROPRIATE: 'Conteúdo Impróprio',
			WRONG_CATEGORY: 'Categoria Errada',
			SOLD_ALREADY: 'Já foi Vendido',
			OTHER: 'Outro'
		};
		return reasons[reason] || reason;
	};

	const getTargetIcon = (report) => {
		if (report.reportedUser) {
			return { icon: User, label: 'Usuário' };
		}
		if (report.vehicle) {
			return { icon: Car, label: 'Veículo' };
		}
		if (report.peca) {
			return { icon: Wrench, label: 'Peça' };
		}
		return { icon: FileText, label: 'Item' };
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('pt-BR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	const getTargetName = (report) => {
		if (report.reportedUser) {
			return `${report.reportedUser.name} ${report.reportedUser.surname}`;
		}
		if (report.vehicle) {
			return report.vehicle.name;
		}
		if (report.peca) {
			return report.peca.name;
		}
		return 'Não identificado';
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<div className="flex items-center gap-3 mb-6">
					<div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
						<AlertTriangle className="w-6 h-6 text-white" />
					</div>
					<div>
						<h2 className="text-2xl font-bold text-gray-900">Minhas Denúncias</h2>
						<p className="text-sm text-gray-500 mt-1">
							{total} {total === 1 ? 'denúncia realizada' : 'denúncias realizadas'}
						</p>
					</div>
				</div>

				{/* Filtros */}
				<div className="flex flex-wrap gap-2 mb-6">
					<button
						onClick={() => { setFilter(''); setPage(1); }}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							!filter
								? 'bg-[#154c9a] text-white'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}
					>
						Todas
					</button>
					<button
						onClick={() => { setFilter('PENDING'); setPage(1); }}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							filter === 'PENDING'
								? 'bg-yellow-500 text-white'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}
					>
						Pendentes
					</button>
					<button
						onClick={() => { setFilter('INVESTIGATING'); setPage(1); }}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							filter === 'INVESTIGATING'
								? 'bg-blue-500 text-white'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}
					>
						Em Investigação
					</button>
					<button
						onClick={() => { setFilter('RESOLVED'); setPage(1); }}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							filter === 'RESOLVED'
								? 'bg-green-500 text-white'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}
					>
						Resolvidas
					</button>
				</div>

				{/* Lista de Denúncias */}
				{loading ? (
					<ListSkeleton count={5} variant="compact" />
				) : reports.length === 0 ? (
					<div className="text-center py-16">
						<AlertTriangle className="w-20 h-20 text-gray-300 mx-auto mb-4" />
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
							{filter ? 'Nenhuma denúncia com este filtro' : 'Nenhuma denúncia ainda'}
						</h3>
						<p className="text-gray-600 mb-6">
							{filter
								? 'Tente selecionar outro filtro'
								: 'Se você encontrar conteúdo inadequado, não hesite em denunciar'}
						</p>
					</div>
				) : (
					<div className="space-y-4">
						{reports.map((report) => {
							const targetInfo = getTargetIcon(report);
							const TargetIcon = targetInfo.icon;

							return (
								<div
									key={report.id}
									className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
								>
									<div className="flex items-start justify-between mb-4">
										<div className="flex-1">
											{/* Target e Status */}
											<div className="flex items-center gap-3 mb-3">
												<div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
													<TargetIcon className="w-5 h-5 text-gray-600" />
												</div>
												<div>
													<h3 className="font-bold text-gray-900">
														{targetInfo.label}: {getTargetName(report)}
													</h3>
													<div className="flex items-center gap-2 text-sm text-gray-600">
														<Calendar className="w-4 h-4" />
														<span>{formatDate(report.createdAt)}</span>
													</div>
												</div>
											</div>

											{/* Motivo */}
											<div className="bg-gray-50 rounded-lg p-4 mt-3">
												<div className="flex items-start gap-2 mb-2">
													<AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
													<div>
														<p className="text-sm font-medium text-gray-700">
															Motivo: {getReasonLabel(report.reason)}
														</p>
														{report.description && (
															<p className="text-sm text-gray-600 mt-1">
																{report.description}
															</p>
														)}
													</div>
												</div>
											</div>
										</div>

										{/* Status */}
										<div className="ml-4">
											{getStatusBadge(report.status)}
										</div>
									</div>
								</div>
							);
						})}

						{/* Paginação */}
						{totalPages > 1 && (
							<div className="flex items-center justify-between pt-6 border-t">
								<p className="text-sm text-gray-600">
									Mostrando {((page - 1) * 10) + 1} a {Math.min(page * 10, total)} de {total} denúncias
								</p>
								<div className="flex gap-2">
									<button
										onClick={() => setPage(p => Math.max(1, p - 1))}
										disabled={page === 1}
										className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
									>
										Anterior
									</button>
									<button
										onClick={() => setPage(p => Math.min(totalPages, p + 1))}
										disabled={page === totalPages}
										className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
									>
										Próximo
									</button>
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default Denuncias;
