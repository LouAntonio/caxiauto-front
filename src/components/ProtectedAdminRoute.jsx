import React from 'react';
import { Navigate } from 'react-router-dom';
import useAdminStore from '../stores/adminStore';
import { Loader2 } from 'lucide-react';

const ProtectedAdminRoute = ({ children }) => {
	const { admin, loading, checkIsLoggedIn } = useAdminStore();
	const [isValidating, setIsValidating] = React.useState(true);
	const [isAuthenticated, setIsAuthenticated] = React.useState(false);

	React.useEffect(() => {
		const validateAdmin = async () => {
			const isLoggedIn = await checkIsLoggedIn();
			if (!isLoggedIn) {
				localStorage.removeItem('caxiauto_admin');
				localStorage.removeItem('caxiauto_admin_token');
			}
			setIsAuthenticated(isLoggedIn);
			setIsValidating(false);
		};

		validateAdmin();
	}, [checkIsLoggedIn]);

	if (loading || isValidating) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<Loader2 className="w-12 h-12 text-[#154c9a] animate-spin mx-auto mb-4" />
					<p className="text-gray-600 font-medium">Carregando painel administrativo...</p>
				</div>
			</div>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to="/caxiauto/login" replace />;
	}

	return children;
};

export default ProtectedAdminRoute;
