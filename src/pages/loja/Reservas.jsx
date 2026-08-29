import React, { useState } from 'react';
import { notyf } from '../../services/api';
import {
	Calendar,
	CalendarCheck,
	Clock,
	CheckCircle,
	XCircle,
	Car,
	MapPin,
	Euro,
	Eye,
	Phone,
	Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { formatKz, formatDate as formatDatePt } from '../../utils/format';
import { ListSkeleton } from '../../components/skeletons';
import ButtonLoader from '../../components/ButtonLoader';
import LojaPageHeader from './PageHeader';
import { useSellerBookings, useUpdateBookingStatus } from '../../hooks/queries/useBookings';

const STATUS_CONFIG = {
	PENDING: {
		label: 'Pendente',
		icon: Clock,
		bg: 'bg-yellow-100',
		text: 'text-yellow-700',
		border: 'border-yellow-200'
	},
	CONFIRMED: {
		label: 'Confirmada',
		icon: CheckCircle,
		bg: 'bg-green-100',
		text: 'text-green-700',
		border: 'border-green-200'
	},
	ACTIVE: {
		label: 'Ativa',
		icon: CalendarCheck,
		bg: 'bg-blue-100',
		text: 'text-blue-700',
		border: 'border-blue-200'
	},
	CANCELLED: {
		label: 'Cancelada',
		icon: XCircle,
		bg: 'bg-red-100',
		text: 'text-red-700',
		border: 'border-red-200'
	},
	COMPLETED: {
		label: 'Concluída',
		icon: CheckCircle,
		bg: 'bg-gray-100',
		text: 'text-gray-700',
		border: 'border-gray-200'
	}
};

const Reservas = () => {
	useDocumentTitle('Reservas Recebidas - Minha Loja');

	const [filter, setFilter] = useState('PENDING');
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [total, setTotal] = useState(0);
	const [actionId, setActionId] = useState(null);

	const params = { page, limit: 10, ...(filter && { status: filter }) };
	const { data: result, isLoading } = useSellerBookings(params);
	const reservas = result?.data || [];
	const updateStatus = useUpdateBookingStatus();

	React.useEffect(() => {
		setTotal(result?.pagination?.total || 0);
		setTotalPages(result?.pagination?.totalPages || 1);
	}, [result]);

	React.useEffect(() => {
		setPage(1);
	}, [filter]);

	const handleStatus = async (reservaId, status) => {
		if (actionId) return;

		const isCancel = status === 'CANCELLED';
		const message = isCancel
			? 'Recusar esta reserva? O cliente será notificado.'
			: 'Confirmar esta reserva? As datas ficarão bloqueadas.';

		if (!window.confirm(message)) return;

		setActionId(reservaId);
		try {
			const response = await updateStatus.mutateAsync({ id: reservaId, status });
			if (response?.success) {
				notyf.success(isCancel ? 'Reserva recusada' : 'Reserva confirmada');
			}
		} catch (error) {
			notyf.error(error?.message || 'Erro ao atualizar reserva');
		} finally {
			setActionId(null);
		}
	};

	const getStatusBadge = (status) => {
		const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
		const Icon = config.icon;
		return (
			<span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text} border ${config.border}`}>
				<Icon className="w-3.5 h-3.5" />
				{config.label}
			</span>
		);
	};

	const calculateDays = (startDate, endDate) => {
		const start = new Date(startDate);
		const end = new Date(endDate);
		return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
	};

	const formatPrice = (price) => formatKz(price);

	return (
		<div className="space-y-6">
			<LojaPageHeader
				eyebrow="Painel do Vendedor"
				title="Reservas Recebidas"
				description="Confirme ou recuse os pedidos de reserva dos seus veículos."
			/>

			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				{/* Filtros */}
				<div className="flex flex-wrap gap-2 mb-6">
					{[
						{ key: 'PENDING', label: 'Pendentes', active: 'bg-yellow-500 text-white', inactive: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
						{ key: 'CONFIRMED', label: 'Confirmadas', active: 'bg-green-500 text-white', inactive: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
						{ key: 'ACTIVE', label: 'Ativas', active: 'bg-blue-500 text-white', inactive: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
						{ key: 'CANCELLED', label: 'Canceladas', active: 'bg-red-500 text-white', inactive: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
						{ key: 'COMPLETED', label: 'Concluídas', active: 'bg-gray-700 text-white', inactive: 'bg-gray-100 text-gray-700 hover:bg-gray-200' }
					].map((opt) => (
						<button
							key={opt.key}
							onClick={() => setFilter(opt.key)}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === opt.key ? opt.active : opt.inactive}`}
						>
							{opt.label}
						</button>
					))}
				</div>

				{isLoading ? (
					<ListSkeleton count={5} />
				) : !reservas || reservas.length === 0 ? (
					<div className="text-center py-16">
						<Calendar className="w-20 h-20 text-gray-300 mx-auto mb-4" />
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
							{filter === 'PENDING' ? 'Sem reservas pendentes' : 'Nenhuma reserva com este filtro'}
						</h3>
						<p className="text-gray-600 mb-6">
							{filter === 'PENDING'
								? 'Quando um cliente reservar um dos seus veículos, o pedido aparece aqui.'
								: 'Tente selecionar outro filtro.'}
						</p>
						<Link
							to="/minha-loja/veiculos-aluguel"
							className="inline-block bg-[#154c9a] text-white px-6 py-3 rounded-lg hover:bg-[#123f80] transition-colors"
						>
							Ver meus veículos para aluguer
						</Link>
					</div>
				) : (
					<div className="space-y-4">
						{reservas.map((reserva) => (
							<div
								key={reserva.id}
								className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
							>
								<div className="flex flex-col lg:flex-row lg:items-start gap-6">
									<div className="flex-1">
										<div className="flex items-start justify-between mb-4 gap-4">
											<div>
												<h3 className="text-lg font-bold text-gray-900 mb-2">
													{reserva.Vehicle?.Manufacturer?.name
														? `${reserva.Vehicle.Manufacturer.name} ${reserva.Vehicle.name}`
														: reserva.Vehicle?.name || 'Veículo'}
												</h3>
												<div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
													<div className="flex items-center gap-1.5">
														<Calendar className="w-4 h-4" />
														<span>{formatDatePt(reserva.startDate)}</span>
													</div>
													<span>→</span>
													<div className="flex items-center gap-1.5">
														<Calendar className="w-4 h-4" />
														<span>{formatDatePt(reserva.endDate)}</span>
													</div>
													<div className="flex items-center gap-1.5">
														<Clock className="w-4 h-4" />
														<span>{calculateDays(reserva.startDate, reserva.endDate)} dias</span>
													</div>
												</div>
											</div>
											{getStatusBadge(reserva.status)}
										</div>

										<div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 p-4 bg-gray-50 rounded-lg">
											<div className="flex items-center gap-2">
												<Car className="w-4 h-4 text-gray-400" />
												<div>
													<p className="text-xs text-gray-500">Ano</p>
													<p className="text-sm font-medium text-gray-900">{reserva.Vehicle?.year || '—'}</p>
												</div>
											</div>
											<div className="flex items-center gap-2">
												<MapPin className="w-4 h-4 text-gray-400" />
												<div>
													<p className="text-xs text-gray-500">Local</p>
													<p className="text-sm font-medium text-gray-900">{reserva.Vehicle?.provincia?.replace('_', ' ') || '—'}</p>
												</div>
											</div>
											<div className="flex items-center gap-2">
												<Euro className="w-4 h-4 text-gray-400" />
												<div>
													<p className="text-xs text-gray-500">Total</p>
													<p className="text-sm font-medium text-gray-900">{formatPrice(reserva.totalPrice)}</p>
												</div>
											</div>
											<div className="flex items-center gap-2">
												<Phone className="w-4 h-4 text-gray-400" />
												<div className="min-w-0">
													<p className="text-xs text-gray-500">Cliente</p>
													<p className="text-sm font-medium text-gray-900 truncate">
														{reserva.User?.name} {reserva.User?.surname || ''}
													</p>
												</div>
											</div>
										</div>

										<div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
											<span className="inline-flex items-center gap-1.5">
												<Mail className="w-4 h-4 text-gray-400" />
												{reserva.User?.email || '—'}
											</span>
											<span className="inline-flex items-center gap-1.5">
												<Phone className="w-4 h-4 text-gray-400" />
												{reserva.User?.phone || '—'}
											</span>
										</div>
									</div>

									<div className="flex flex-col gap-2 lg:pl-6 lg:border-l">
										<Link
											to={`/servicos/aluguel-de-automoveis/${reserva.vehicleId}`}
											className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
										>
											<Eye className="w-4 h-4" />
											Ver Veículo
										</Link>
										{reserva.status === 'PENDING' && (
											<>
												<ButtonLoader
													onClick={() => handleStatus(reserva.id, 'CONFIRMED')}
													loading={actionId === reserva.id}
													loadingText="Confirmando..."
													variant="success"
													size="sm"
												>
													<CheckCircle className="w-4 h-4" />
													Confirmar
												</ButtonLoader>
												<ButtonLoader
													onClick={() => handleStatus(reserva.id, 'CANCELLED')}
													loading={actionId === reserva.id}
													loadingText="Recusando..."
													variant="red_outline"
													size="sm"
												>
													<XCircle className="w-4 h-4" />
													Recusar
												</ButtonLoader>
											</>
										)}
										{reserva.status === 'CONFIRMED' && (
											<ButtonLoader
												onClick={() => handleStatus(reserva.id, 'ACTIVE')}
												loading={actionId === reserva.id}
												loadingText="A iniciar..."
												variant="primary"
												size="sm"
											>
												<CalendarCheck className="w-4 h-4" />
												Iniciar aluguer
											</ButtonLoader>
										)}
										{reserva.status === 'ACTIVE' && (
											<ButtonLoader
												onClick={() => handleStatus(reserva.id, 'COMPLETED')}
												loading={actionId === reserva.id}
												loadingText="A concluir..."
												variant="success"
												size="sm"
											>
												<CheckCircle className="w-4 h-4" />
												Concluir
											</ButtonLoader>
										)}
									</div>
								</div>
							</div>
						))}

						{totalPages > 1 && (
							<div className="flex items-center justify-between pt-6 border-t">
								<p className="text-sm text-gray-600">
									A mostrar {((page - 1) * 10) + 1} a {Math.min(page * 10, total)} de {total} reservas
								</p>
								<div className="flex gap-2">
									<button
										onClick={() => setPage((p) => Math.max(1, p - 1))}
										disabled={page === 1}
										className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
									>
										Anterior
									</button>
									<button
										onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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

export default Reservas;