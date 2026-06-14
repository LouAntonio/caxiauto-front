import { useMutation } from '@tanstack/react-query';
import api from '../../services/api';

export const useSendContact = () => {
	return useMutation({
		mutationFn: (data) => api.contact(data),
	});
};

export const useSendInsuranceContact = () => {
	return useMutation({
		mutationFn: (data) => api.contactInsurance(data),
	});
};

export const useSendVehiclePurchaseContact = () => {
	return useMutation({
		mutationFn: (data) => api.contactVehiclePurchase(data),
	});
};

export const useSendVehicleVisitContact = () => {
	return useMutation({
		mutationFn: (data) => api.contactVehicleVisit(data),
	});
};

export const useSendRentalRequestContact = () => {
	return useMutation({
		mutationFn: (data) => api.contactRentalRequest(data),
	});
};

export const useSendPartPurchaseContact = () => {
	return useMutation({
		mutationFn: (data) => api.contactPartPurchase(data),
	});
};
