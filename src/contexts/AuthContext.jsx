import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	// Carregar usuário do localStorage ao iniciar
	useEffect(() => {
		const storedUser = localStorage.getItem('caxiauto_user');
		if (storedUser) {
			try {
				setUser(JSON.parse(storedUser));
			} catch (error) {
				console.error('Erro ao carregar usuário:', error);
				localStorage.removeItem('caxiauto_user');
			}
		}
		setLoading(false);
	}, []);

	// Função de registro
	const register = async (userData) => {
		try {
			// Verificar se o email já existe
			const users = JSON.parse(localStorage.getItem('caxiauto_users') || '[]');
			const emailExists = users.some(u => u.email === userData.email);

			if (emailExists) {
				throw new Error('Email já cadastrado');
			}

			// Criar novo usuário
			const newUser = {
				id: Date.now().toString(),
				name: userData.name,
				email: userData.email,
				password: userData.password, // Em produção, usar hash
				phone: userData.phone || '',
				createdAt: new Date().toISOString(),
			};

			// Salvar na lista de usuários
			users.push(newUser);
			localStorage.setItem('caxiauto_users', JSON.stringify(users));

			// Fazer login automático
			const userToStore = { ...newUser };
			delete userToStore.password; // Não armazenar senha no user logado

			setUser(userToStore);
			localStorage.setItem('caxiauto_user', JSON.stringify(userToStore));

			return { success: true };
		} catch (error) {
			return { success: false, error: error.message };
		}
	};

	// Função de login
	const login = async (email, password) => {
		try {
			const users = JSON.parse(localStorage.getItem('caxiauto_users') || '[]');
			const foundUser = users.find(u => u.email === email && u.password === password);

			if (!foundUser) {
				throw new Error('Email ou senha incorretos');
			}

			const userToStore = { ...foundUser };
			delete userToStore.password; // Não armazenar senha no user logado

			setUser(userToStore);
			localStorage.setItem('caxiauto_user', JSON.stringify(userToStore));

			return { success: true };
		} catch (error) {
			return { success: false, error: error.message };
		}
	};

	// Função de logout
	const logout = () => {
		setUser(null);
		localStorage.removeItem('caxiauto_user');
	};

	// Função para atualizar dados do usuário
	const updateUser = async (updatedData) => {
		try {
			const users = JSON.parse(localStorage.getItem('caxiauto_users') || '[]');
			const userIndex = users.findIndex(u => u.id === user.id);

			if (userIndex === -1) {
				throw new Error('Usuário não encontrado');
			}

			// Atualizar dados
			users[userIndex] = { ...users[userIndex], ...updatedData };
			localStorage.setItem('caxiauto_users', JSON.stringify(users));

			// Atualizar usuário logado
			const updatedUser = { ...users[userIndex] };
			delete updatedUser.password;

			setUser(updatedUser);
			localStorage.setItem('caxiauto_user', JSON.stringify(updatedUser));

			return { success: true };
		} catch (error) {
			return { success: false, error: error.message };
		}
	};

	const value = {
		user,
		loading,
		login,
		register,
		logout,
		updateUser,
		isAuthenticated: !!user,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth deve ser usado dentro de AuthProvider');
	}
	return context;
};
