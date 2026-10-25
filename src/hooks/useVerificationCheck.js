import { useAuthStore } from '../stores/authStore';

export const useVerificationCheck = () => {
	const { user } = useAuthStore();

	const isVerified = user?.isVerified === true;
	const needsVerification = user?.role === 'SELLER' && !isVerified;

	return { isVerified, needsVerification };
};