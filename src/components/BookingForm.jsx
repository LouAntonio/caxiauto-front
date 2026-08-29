import React, { useState } from 'react';
import { formatKz, toLocalDateString } from '../utils/format';
import { notyf } from '../services/api';
import { useCreateBooking } from '../hooks/queries/useBookings';
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
	const createBookingMutation = useCreateBooking();
	const [showForm, setShowForm] = useState(false);
	const [loading, setLoading] = useState(false);
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');

	const calculateDays = () => {
		if (!startDate || !endDate) return 0;
		const start = new Date(startDate);
		const end = new Date(endDate);
		const diffTime = Math.abs(end - start);
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays > 0 ? diffDays : 0;
	};

	const calculateTotalPrice = () => {
		const days = calculateDays();
		if (!days || !vehicle?.price) return 0;
		return vehicle.price * days;
	};

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

	const handleCreateBooking = async () => {
		if (!validateDates()) return;

		setLoading(true);
		try {
			const response = await createBookingMutation.mutateAsync({ vehicleId: vehicle.id, startDate, endDate });

			if (response.success) {
				notyf.success('Reserva criada com sucesso! Aguarde confirmação do proprietário.');
				setStartDate('');
				setEndDate('');
				setShowForm(false);
				if (onBookingCreated) {
					onBookingCreated(response.data);
				}
			} else {
				notyf.error(response.message || 'Erro ao criar reserva');
			}
		} catch (error) {
			console.error('Erro ao criar reserva:', error);
			notyf.error('Erro ao criar reserva. Tente novamente.');
		} finally {
			setLoading(false);
		}
	};

	const formatPrice = (price) => formatKz(price);

	const getMinDate = () => toLocalDateString(new Date());

	if (!showForm) {
		return (
			<button
				onClick={() => setShowForm(true)}
				className="w-full bg-[#154c9a] text-white py-3 px-6 rounded-2xl hover:bg-[#0c2d5e] transition-all duration-300 font-semibold font-body flex items-center justify-center gap-2"
			>
				<Calendar className="w-5 h-5" />
				Reservar Veículo
			</button>
		);
	}

	const days = calculateDays();
	const totalPrice = calculateTotalPrice();

	return (
		<div className="bg-white border border-[#e5e7eb] rounded-2xl p-6">
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-2">
					<Calendar className="w-6 h-6 text-[#154c9a]" />
					<h3 className="font-display text-lg font-bold text-[#111827]">Reservar Veículo</h3>
				</div>
				<button
					onClick={() => setShowForm(false)}
					className="p-2 hover:bg-[#f8f6f2] rounded-lg transition-colors cursor-pointer"
				>
					<X className="w-5 h-5 text-[#6b7280]" />
				</button>
			</div>

			<div className="space-y-4 mb-6">
				<div>
					<label className="block font-body text-sm font-medium text-[#6b7280] mb-2">
						Data de Início
					</label>
					<input
						type="date"
						value={startDate}
						onChange={(e) => setStartDate(e.target.value)}
						min={getMinDate()}
						className="w-full px-4 py-3 border border-[#e5e7eb] rounded-xl font-body focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20 outline-none transition-all"
					/>
				</div>

				<div>
					<label className="block font-body text-sm font-medium text-[#6b7280] mb-2">
						Data de Fim
					</label>
					<input
						type="date"
						value={endDate}
						onChange={(e) => setEndDate(e.target.value)}
						min={startDate || getMinDate()}
						className="w-full px-4 py-3 border border-[#e5e7eb] rounded-xl font-body focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]/20 outline-none transition-all"
					/>
				</div>
			</div>

			{days > 0 && (
				<div className="bg-[#f8f6f2] rounded-xl p-4 mb-6 space-y-3">
					<div className="flex items-center justify-between font-body text-sm">
						<div className="flex items-center gap-2 text-[#6b7280]">
							<Clock className="w-4 h-4" />
							<span>Duração</span>
						</div>
						<span className="font-semibold text-[#111827]">{days} {days === 1 ? 'dia' : 'dias'}</span>
					</div>
					<div className="flex items-center justify-between font-body text-sm">
						<div className="flex items-center gap-2 text-[#6b7280]">
							<Euro className="w-4 h-4" />
							<span>Preço/dia</span>
						</div>
						<span className="font-semibold text-[#111827]">{formatPrice(vehicle?.price)}</span>
					</div>
					{vehicle?.price && (
						<div className="border-t border-[#e5e7eb] pt-3 mt-3">
							<div className="flex items-center justify-between">
								<span className="font-medium text-[#6b7280] font-body">Total Estimado</span>
								<span className="text-xl font-bold text-[#154c9a] font-['JetBrains_Mono',monospace]">{formatPrice(totalPrice)}</span>
							</div>
						</div>
					)}
				</div>
			)}

			<div className="bg-[#eef3fa] border border-[#154c9a]/20 rounded-xl p-3 mb-6">
				<div className="flex items-start gap-2">
					<AlertCircle className="w-5 h-5 text-[#154c9a] mt-0.5 flex-shrink-0" />
					<p className="font-body text-sm text-[#154c9a]">
						A reserva será enviada ao proprietário para confirmação. Você receberá uma notificação quando for confirmada.
					</p>
				</div>
			</div>

			<button
				onClick={handleCreateBooking}
				disabled={loading || !startDate || !endDate}
				className="w-full bg-[#154c9a] text-white py-3 px-6 rounded-2xl hover:bg-[#0c2d5e] transition-all duration-300 font-semibold font-body flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
