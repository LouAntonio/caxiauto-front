import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api, { getImageUrl, notyf } from '../../services/api';
import {
	Calendar,
	Clock,
	CheckCircle,
	XCircle,
	AlertCircle,
	Car,
	MapPin,
	Euro,
	Eye,
	Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const Reservas = () => {
	useDocumentTitle('Minhas Reservas - CaxiAuto');

	const { user } = useAuth();
	const [reservas, setReservas] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState('');
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [total, setTotal] = useState(0);

	useEffect(() => {
		fetchReservas();
	}, [filter, page]);

	const fetchReservas = async () => {
		setLoading(true);
		try {
			const params = { page, limit: 10 };
			if (filter) params.status = filter;

			const response = await api.getMyBookings(params);

			if (response.success) {
				setReservas(response.data || []);
				setTotal(response.pagination?.total || 0);
				setTotalPages(response.pagination?.totalPages || 1);
			} else {
				notyf.error('Erro ao carregar reservas');
				setReservas([]);
			}
		} catch (error) {
			console.error('Erro ao carregar reservas:', error);
			notyf.error('Erro ao carregar reservas');
		} finally {
			setLoading(false);
		}
	};

	const handleCancelReserva = async (reservaId) => {
		if (!window.confirm('Tem certeza que deseja cancelar esta reserva?')) {
			return;
		}

		try {
			const response = await api.cancelBooking(reservaId);

			if (response.success) {
				notyf.success('Reserva cancelada com sucesso');
				fetchReservas();
			} else {
				notyf.error(response.msg || 'Erro ao cancelar reserva');
			}
		} catch (error) {
			console.error('Erro ao cancelar reserva:', error);
			notyf.error('Erro ao cancelar reserva');
		}
	};

	const getStatusBadge = (status) => {
		const statusConfig = {
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
				bg: 'bg-blue-100',
				text: 'text-blue-700',
				border: 'border-blue-200'
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

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('pt-BR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		});
	};

	const calculateDays = (startDate, endDate) => {
		const start = new Date(startDate);
		const end = new Date(endDate);
		const diffTime = Math.abs(end - start);
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	};

	const formatPrice = (price) => {
		return new Intl.NumberFormat('pt-AO', {
			style: 'currency',
			currency: 'AOA'
		}).format(price);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<div className="flex items-center gap-3 mb-6">
					<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
						<Calendar className="w-6 h-6 text-white" />
					</div>
					<div>
						<h2 className="text-2xl font-bold text-gray-900">Minhas Reservas</h2>
						<p className="text-sm text-gray-500 mt-1">
							{total} {total === 1 ? 'reserva encontrada' : 'reservas encontradas'}
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
						onClick={() => { setFilter('CONFIRMED'); setPage(1); }}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							filter === 'CONFIRMED'
								? 'bg-green-500 text-white'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}
					>
						Confirmadas
					</button>
					<button
						onClick={() => { setFilter('CANCELLED'); setPage(1); }}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							filter === 'CANCELLED'
								? 'bg-red-500 text-white'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}
					>
						Canceladas
					</button>
					<button
						onClick={() => { setFilter('COMPLETED'); setPage(1); }}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							filter === 'COMPLETED'
								? 'bg-blue-500 text-white'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}
					>
						Concluídas
					</button>
				</div>

				{/* Lista de Reservas */}
				{loading ? (
					<div className="flex items-center justify-center py-16">
						<div className="text-center">
							<Loader2 className="w-12 h-12 animate-spin text-[#154c9a] mx-auto mb-4" />
							<p className="text-gray-600">Carregando reservas...</p>
						</div>
					</div>
				) : reservas.length === 0 ? (
					<div className="text-center py-16">
						<Calendar className="w-20 h-20 text-gray-300 mx-auto mb-4" />
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
							{filter ? 'Nenhuma reserva com este filtro' : 'Nenhuma reserva ainda'}
						</h3>
						<p className="text-gray-600 mb-6">
							{filter
								? 'Tente selecionar outro filtro'
								: 'Alugue um veículo para criar sua primeira reserva'}
						</p>
						<Link
							to="/servicos/aluguel-de-automoveis"
							className="inline-block bg-[#154c9a] text-white px-6 py-3 rounded-lg hover:bg-[#123f80] transition-colors"
						>
							Ver Veículos para Aluguel
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
									{/* Informações da Reserva */}
									<div className="flex-1">
										<div className="flex items-start justify-between mb-4">
											<div>
												<h3 className="text-lg font-bold text-gray-900 mb-2">
													{reserva.Vehicle?.name || 'Veículo'}
												</h3>
												<div className="flex items-center gap-4 text-sm text-gray-600">
													<div className="flex items-center gap-1.5">
														<Calendar className="w-4 h-4" />
														<span>{formatDate(reserva.startDate)}</span>
													</div>
													<span>→</span>
													<div className="flex items-center gap-1.5">
														<Calendar className="w-4 h-4" />
														<span>{formatDate(reserva.endDate)}</span>
													</div>
													<div className="flex items-center gap-1.5">
														<Clock className="w-4 h-4" />
														<span>{calculateDays(reserva.startDate, reserva.endDate)} dias</span>
													</div>
												</div>
											</div>
											{getStatusBadge(reserva.status)}
										</div>

										{/* Detalhes do Veículo */}
										{reserva.Vehicle && (
											<div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 p-4 bg-gray-50 rounded-lg">
												<div className="flex items-center gap-2">
													<Car className="w-4 h-4 text-gray-400" />
													<div>
														<p className="text-xs text-gray-500">Ano</p>
														<p className="text-sm font-medium text-gray-900">{reserva.Vehicle.year}</p>
													</div>
												</div>
												<div className="flex items-center gap-2">
													<MapPin className="w-4 h-4 text-gray-400" />
													<div>
														<p className="text-xs text-gray-500">Local</p>
														<p className="text-sm font-medium text-gray-900">
															{reserva.Vehicle.provincia?.replace('_', ' ')}
														</p>
													</div>
												</div>
												<div className="flex items-center gap-2">
													<Euro className="w-4 h-4 text-gray-400" />
													<div>
														<p className="text-xs text-gray-500">Preço/dia</p>
														<p className="text-sm font-medium text-gray-900">
															{reserva.Vehicle.priceRentDay ? formatPrice(reserva.Vehicle.priceRentDay) : '—'}
														</p>
													</div>
												</div>
												<div className="flex items-center gap-2">
													<Eye className="w-4 h-4 text-gray-400" />
													<div>
														<p className="text-xs text-gray-500">Total</p>
														<p className="text-sm font-medium text-gray-900">
															{reserva.Vehicle.priceRentDay
																? formatPrice(reserva.Vehicle.priceRentDay * calculateDays(reserva.startDate, reserva.endDate))
																: '—'}
														</p>
													</div>
												</div>
											</div>
										)}
									</div>

									{/* Ações */}
									<div className="flex flex-col gap-2 lg:pl-6 lg:border-l">
										<Link
											to={`/servicos/aluguel-de-automoveis/${reserva.vehicleId}`}
											className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
										>
											<Eye className="w-4 h-4" />
											Ver Veículo
										</Link>
										{(reserva.status === 'PENDING' || reserva.status === 'CONFIRMED') && (
											<button
												onClick={() => handleCancelReserva(reserva.id)}
												className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
											>
												<XCircle className="w-4 h-4" />
												Cancelar
											</button>
										)}
									</div>
								</div>
							</div>
						))}

						{/* Paginação */}
						{totalPages > 1 && (
							<div className="flex items-center justify-between pt-6 border-t">
								<p className="text-sm text-gray-600">
									Mostrando {((page - 1) * 10) + 1} a {Math.min(page * 10, total)} de {total} reservas
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

export default Reservas;
