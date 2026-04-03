import React, { useState } from 'react';
import api, { notyf } from '../services/api';
import {
	Calendar,
	Clock,
	Euro,
	AlertCircle,
	CheckCircle,
	X,
	Loader2
} from 'lucide-react';

const BookingForm = ({ vehicle, onBookingCreated }) => {
	const [showForm, setShowForm] = useState(false);
	const [loading, setLoading] = useState(false);
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');

	// Calcular dias entre datas
	const calculateDays = () => {
		if (!startDate || !endDate) return 0;
		const start = new Date(startDate);
		const end = new Date(endDate);
		const diffTime = Math.abs(end - start);
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays > 0 ? diffDays : 0;
	};

	// Calcular preço total
	const calculateTotalPrice = () => {
		const days = calculateDays();
		if (!days || !vehicle?.price) return 0;
		return vehicle.price * days;
	};

	// Validar datas
	const validateDates = () => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const start = new Date(startDate);
		const end = new Date(endDate);

		if (!startDate || !endDate) {
			notyf.error('Selecione as datas de início e fim');
			return false;
		}

		if (start < today) {
			notyf.error('A data de início não pode ser no passado');
			return false;
		}

		if (end <= start) {
			notyf.error('A data de fim deve ser posterior à data de início');
			return false;
		}

		return true;
	};

	// Criar reserva
	const handleCreateBooking = async () => {
		if (!validateDates()) return;

		setLoading(true);
		try {
			const response = await api.createBooking(vehicle.id, startDate, endDate);

			if (response.success) {
				notyf.success('Reserva criada com sucesso! Aguarde confirmação do proprietário.');
				setStartDate('');
				setEndDate('');
				setShowForm(false);
				if (onBookingCreated) {
					onBookingCreated(response.data);
				}
			} else {
				notyf.error(response.msg || 'Erro ao criar reserva');
			}
		} catch (error) {
			console.error('Erro ao criar reserva:', error);
			notyf.error('Erro ao criar reserva. Tente novamente.');
		} finally {
			setLoading(false);
		}
	};

	// Formatar preço
	const formatPrice = (price) => {
		return new Intl.NumberFormat('pt-AO', {
			style: 'currency',
			currency: 'AOA'
		}).format(price);
	};

	// Obter data mínima (hoje)
	const getMinDate = () => {
		const today = new Date();
		return today.toISOString().split('T')[0];
	};

	if (!showForm) {
		return (
			<button
				onClick={() => setShowForm(true)}
				className="w-full bg-[#154c9a] text-white py-3 px-6 rounded-lg hover:bg-[#123f80] transition-colors font-semibold flex items-center justify-center gap-2"
			>
				<Calendar className="w-5 h-5" />
				Reservar Veículo
			</button>
		);
	}

	const days = calculateDays();
	const totalPrice = calculateTotalPrice();

	return (
		<div className="bg-white border-2 border-[#154c9a] rounded-xl p-6">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-2">
					<Calendar className="w-6 h-6 text-[#154c9a]" />
					<h3 className="text-lg font-bold text-gray-900">Reservar Veículo</h3>
				</div>
				<button
					onClick={() => setShowForm(false)}
					className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
				>
					<X className="w-5 h-5 text-gray-500" />
				</button>
			</div>

			{/* Seleção de Datas */}
			<div className="space-y-4 mb-6">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Data de Início
					</label>
					<input
						type="date"
						value={startDate}
						onChange={(e) => setStartDate(e.target.value)}
						min={getMinDate()}
						className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#154c9a] focus:border-transparent"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Data de Fim
					</label>
					<input
						type="date"
						value={endDate}
						onChange={(e) => setEndDate(e.target.value)}
						min={startDate || getMinDate()}
						className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#154c9a] focus:border-transparent"
					/>
				</div>
			</div>

			{/* Resumo da Reserva */}
			{days > 0 && (
				<div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
					<div className="flex items-center justify-between text-sm">
						<div className="flex items-center gap-2 text-gray-600">
							<Clock className="w-4 h-4" />
							<span>Duração</span>
						</div>
						<span className="font-semibold text-gray-900">{days} {days === 1 ? 'dia' : 'dias'}</span>
					</div>
					<div className="flex items-center justify-between text-sm">
						<div className="flex items-center gap-2 text-gray-600">
							<Euro className="w-4 h-4" />
							<span>Preço/dia</span>
						</div>
						<span className="font-semibold text-gray-900">{formatPrice(vehicle?.price)}</span>
					</div>
					{vehicle?.price && (
						<div className="border-t pt-3 mt-3">
							<div className="flex items-center justify-between">
								<span className="font-medium text-gray-700">Total Estimado</span>
								<span className="text-xl font-bold text-[#154c9a]">{formatPrice(totalPrice)}</span>
							</div>
						</div>
					)}
				</div>
			)}

			{/* Aviso */}
			<div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
				<div className="flex items-start gap-2">
					<AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
					<p className="text-sm text-blue-700">
						A reserva será enviada ao proprietário para confirmação. Você receberá uma notificação quando for confirmada.
					</p>
				</div>
			</div>

			{/* Botão de Confirmar */}
			<button
				onClick={handleCreateBooking}
				disabled={loading || !startDate || !endDate}
				className="w-full bg-[#154c9a] text-white py-3 px-6 rounded-lg hover:bg-[#123f80] transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{loading ? (
					<>
						<Loader2 className="w-5 h-5 animate-spin" />
						Criando Reserva...
					</>
				) : (
					<>
						<CheckCircle className="w-5 h-5" />
						Confirmar Reserva
					</>
				)}
			</button>
		</div>
	);
};

export default BookingForm;
