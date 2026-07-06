import { useGoogleOneTapLogin } from '@react-oauth/google';
import useAuthStore from '../stores/authStore';
import { useLocation, useNavigate } from 'react-router-dom';

const GoogleOneTapPrompt = () => {
	const { user, googleLogin } = useAuthStore();
	const location = useLocation();
	const navigate = useNavigate();

	const isAdminRoute = location.pathname.startsWith('/caxiauto');
	const isAuthPage = location.pathname === '/auth';

	useGoogleOneTapLogin({
		onSuccess: async (credentialResponse) => {
			const result = await googleLogin(credentialResponse.credential);
			if (result.success) {
				navigate('/minha-conta', { replace: true });
			}
		},
		onError: () => {},
		disabled: !!user || isAdminRoute || isAuthPage,
		cancel_on_tap_outside: false,
	});

	return null;
};

export default GoogleOneTapPrompt;
