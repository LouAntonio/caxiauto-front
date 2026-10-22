import React from 'react';

/**
 * Rede de segurança de último recurso.
 *
 * Um erro de render não tratado desmonta toda a árvore React e deixa a
 * página em branco. Este boundary mostra um fallback recuperável e,
 * sempre que a rota muda, limpa o erro automaticamente.
 */
export default class ErrorBoundary extends React.Component {
	state = { error: null };

	static getDerivedStateFromError(error) {
		return { error };
	}

	componentDidCatch(error, info) {
		console.error('[ErrorBoundary] Erro de render:', error, info?.componentStack);
	}

	componentDidUpdate(prevProps) {
		// Mudar de rota (ou um reset explícito) volta a tentar renderizar.
		if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
			this.setState({ error: null });
		}
	}

	handleRetry = () => this.setState({ error: null });

	handleReload = () => window.location.reload();

	render() {
		if (!this.state.error) return this.props.children;

		return (
			<div className="min-h-screen flex items-center justify-center bg-[#f8f6f2] px-4">
				<div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-[#e5e7eb] p-8 text-center">
					<h1 className="font-display text-xl font-bold text-[#111827] mb-2">
						Algo correu mal
					</h1>
					<p className="font-body text-sm text-[#6b7280] mb-6">
						Não foi possível mostrar esta página. Tente novamente — se o problema
						persistir, recarregue a página.
					</p>
					<div className="flex flex-col sm:flex-row gap-3 justify-center">
						<button
							onClick={this.handleRetry}
							className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#154c9a] hover:bg-blue-800 transition-all font-body cursor-pointer"
						>
							Tentar novamente
						</button>
						<button
							onClick={this.handleReload}
							className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#154c9a] bg-[#f8f6f2] hover:bg-[#ece7de] transition-all font-body cursor-pointer"
						>
							Recarregar
						</button>
					</div>
				</div>
			</div>
		);
	}
}
