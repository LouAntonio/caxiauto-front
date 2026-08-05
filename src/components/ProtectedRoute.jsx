import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { notyf } from '../services/api';

const isTokenExpired = (token) => {
	if (!token) return true;
	try {
		const payload = JSON.parse(atob(token.split('.')[1]));
		return Date.now() >= payload.exp * 1000;
	} catch {
		return true;
	}
};

const ProtectedRoute = ({ children }) => {
	const { user, loading, logout, checkIsLoggedIn } = useAuthStore();
	const [isVerifying, setIsVerifying] = useState(true);
	const [isServerAuthenticated, setIsServerAuthenticated] = useState(false);
	const location = useLocation();

	useEffect(() => {
		const token = localStorage.getItem('caxiauto_token');

		const verifyServerAuthentication = async () => {
			const currentUser = useAuthStore.getState().user;
			if (!currentUser) {
				setIsVerifying(false);
				return;
			}

			if (isTokenExpired(token)) {
				notyf.error('Sua sessão expirou. Por favor, faça login novamente para aceder à sua conta.');
				logout();
				setIsServerAuthenticated(false);
				setIsVerifying(false);
				return;
			}

			try {
				setIsVerifying(true);
				const isLoggedIn = await checkIsLoggedIn();

				if (!isLoggedIn) {
					notyf.error('Sua sessão expirou. Por favor, faça login novamente para aceder à sua conta.');
					logout();
					setIsServerAuthenticated(false);
				} else {
					setIsServerAuthenticated(true);
				}
			} catch (error) {
				console.error('Erro ao verificar autenticação do servidor:', error);
				notyf.error('Erro ao verificar sua sessão. Faça login novamente para aceder à sua conta.');
				logout();
				setIsServerAuthenticated(false);
			} finally {
				setIsVerifying(false);
			}
		};

		verifyServerAuthentication();
	}, [checkIsLoggedIn, logout]);

	// Mostrar loading enquanto verifica autenticação inicial ou do servidor
	if (loading || isVerifying) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
					<p className="mt-4 text-gray-600">Verificando autenticação...</p>
				</div>
			</div>
		);
	}

	// Se não há usuário local ou não está autenticado no servidor, redirecionar para login
	if (!user || !isServerAuthenticated) {
		return <Navigate to="/auth" state={{ from: location }} replace />;
	}

	return children;
};

export default ProtectedRoute;
