import { useEffect } from 'react';
import useAuthStore from '../stores/authStore';

/**
 * Sincroniza o usuário autenticado com o backend no mount.
 * Evita que role/isVerified/sellerDocs fiquem desatualizados
 * entre sessões ou após submissão de documentos / verificação.
 */
const useSyncUser = () => {
	const { isAuthenticated, refreshUser } = useAuthStore();

	useEffect(() => {
		if (isAuthenticated) {
			refreshUser();
		}
	}, [isAuthenticated, refreshUser]);
};

export default useSyncUser;
