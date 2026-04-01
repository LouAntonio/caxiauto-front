import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { Loader2 } from 'lucide-react';

const ProtectedAdminRoute = ({ children }) => {
	const { admin, loading, checkIsLoggedIn } = useAdmin();
	const [isValidating, setIsValidating] = React.useState(true);
	const [isAuthenticated, setIsAuthenticated] = React.useState(false);

	React.useEffect(() => {
		const validateAdmin = async () => {
			if (admin) {
				// Se já temos admin no contexto, confiar nisso
				setIsAuthenticated(true);
			} else {
				// Caso contrário, validar com o servidor
				const isLoggedIn = await checkIsLoggedIn();
				setIsAuthenticated(isLoggedIn);
			}
			setIsValidating(false);
		};

		validateAdmin();
	}, [admin, loading, checkIsLoggedIn]);

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
