import { useAuth } from '../contexts/AuthContext';

/**
 * Hook para verificar se o usuário está verificado
 * @returns {Object} { isVerified, canCreate, canEdit, needsVerification }
 */
const useVerificationCheck = () => {
	const { user, refreshUser } = useAuth();

	const isVerified = user?.isVerified === true;

	return {
		isVerified,
		canCreate: isVerified,
		canEdit: true, // Edição sempre permitida para itens existentes
		needsVerification: !isVerified,
		refreshUser,
	};
};

export default useVerificationCheck;
