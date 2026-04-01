import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import { Shield, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { notyf } from '../../services/api';

const AdminLogin = () => {
	const navigate = useNavigate();
	const { login, admin } = useAdmin();
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const [error, setError] = useState('');

	// Se já estiver logado, redirecionar para dashboard
	if (admin) {
		navigate('/caxiauto/dashboard');
		return null;
	}

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
		setError('');
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		const result = await login(formData.email, formData.password);

		if (result.success) {
			notyf.success('Login realizado com sucesso!');
			// Pequeno delay para garantir que o estado foi atualizado
			setTimeout(() => {
				navigate('/caxiauto/dashboard');
			}, 100);
		} else {
			setError(result.message || 'Erro ao fazer login');
			notyf.error(result.message || 'Erro ao fazer login');
		}

		setLoading(false);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#154c9a] via-blue-800 to-[#0d2f6e] flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				{/* Logo e Título */}
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-2xl mb-6">
						<Shield className="w-12 h-12 text-[#154c9a]" />
					</div>
					<h1 className="text-4xl font-bold text-white mb-2">Caxiauto</h1>
					<p className="text-blue-200 text-lg">Painel Administrativo</p>
				</div>

				{/* Formulário de Login */}
				<div className="bg-white rounded-2xl shadow-2xl p-8">
					<div className="mb-6">
						<h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Administrativo</h2>
						<p className="text-gray-600">Faça login para acessar o painel</p>
					</div>

					{error && (
						<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
							<AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
							<p className="text-sm text-red-700">{error}</p>
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-5">
						{/* Email */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Email
							</label>
							<div className="relative">
								<Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
								<input
									type="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									placeholder="admin@caxiauto.com"
									className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#154c9a] focus:border-transparent outline-none transition-all"
									required
								/>
							</div>
						</div>

						{/* Senha */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Senha
							</label>
							<div className="relative">
								<Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
								<input
									type="password"
									name="password"
									value={formData.password}
									onChange={handleChange}
									placeholder="••••••••"
									className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#154c9a] focus:border-transparent outline-none transition-all"
									required
								/>
							</div>
						</div>

						{/* Botão de Login */}
						<button
							type="submit"
							disabled={loading}
							className="w-full bg-[#154c9a] text-white py-3 rounded-lg font-semibold hover:bg-[#123f80] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
						>
							{loading ? (
								<>
									<Loader2 className="w-5 h-5 animate-spin" />
									<span>Entrando...</span>
								</>
							) : (
								<span>Entrar</span>
							)}
						</button>
					</form>

					{/* Link para voltar ao site */}
					<div className="mt-6 text-center">
						<a
							href="/"
							className="text-sm text-gray-600 hover:text-[#154c9a] transition-colors"
						>
							← Voltar para o site
						</a>
					</div>
				</div>

				{/* Footer */}
				<div className="text-center mt-6">
					<p className="text-blue-200 text-sm">
						© {new Date().getFullYear()} Caxiauto. Todos os direitos reservados.
					</p>
				</div>
			</div>
		</div>
	);
};

export default AdminLogin;
