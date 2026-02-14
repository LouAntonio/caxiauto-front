import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

// Instância do Notyf para notificações
const notyf = new Notyf({
	duration: 4000,
	position: { x: 'right', y: 'top' },
	dismissible: true,
	ripple: true,
});

const ProtectedRoute = ({ children }) => {
	const { user, loading, logout, checkIsLoggedIn } = useAuth();
	const [isVerifying, setIsVerifying] = useState(true);
	const [isServerAuthenticated, setIsServerAuthenticated] = useState(false);
	const location = useLocation();

	// Verificar autenticação no servidor quando o componente monta ou o usuário muda
	useEffect(() => {
		const verifyServerAuthentication = async () => {
			if (!user) {
				setIsVerifying(false);
				return;
			}

			try {
				setIsVerifying(true);
				const isLoggedIn = await checkIsLoggedIn();
				
				if (!isLoggedIn) {
					// Se não estiver logado no servidor, mostrar notificação e fazer logout local
					notyf.error('Sua sessão expirou. Por favor, faça login novamente para ter acesso ap Painel Administrativo.');
					logout();
					setIsServerAuthenticated(false);
				} else {
					setIsServerAuthenticated(true);
				}
			} catch (error) {
				console.error('Erro ao verificar autenticação do servidor:', error);
				// Em caso de erro, mostrar notificação e fazer logout
				notyf.error('Erro ao verificar sua sessão. Faça login novamente para ter acesso ap Painel Administrativo.');
				logout();
				setIsServerAuthenticated(false);
			} finally {
				setIsVerifying(false);
			}
		};

		verifyServerAuthentication();
	}, [user, checkIsLoggedIn, logout]);

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
