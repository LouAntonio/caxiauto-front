import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
	const { user, loading } = useAuth();
	const location = useLocation();

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
					<p className="mt-4 text-gray-600">Carregando...</p>
				</div>
			</div>
		);
	}

	if (!user) {
		// Redirecionar para login, mas salvar a localização atual
		return <Navigate to="/auth" state={{ from: location }} replace />;
	}

	return children;
};

export default ProtectedRoute;
