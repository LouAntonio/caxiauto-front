import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { handleAdminAuthError } from '../../utils/adminUtils';
import { UserCheck, Search, CheckCircle, XCircle, FileText, Loader2 } from 'lucide-react';
import { notyf } from '../../services/api';

const AdminSellers = () => {
	const { getPendingSellers, getSellerDocs, verifySeller } = useAdmin();
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState('pending');
	const [pendingSellers, setPendingSellers] = useState([]);
	const [sellerDocs, setSellerDocs] = useState([]);
	const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 });

	const loadData = async () => {
		setLoading(true);
		try {
			const params = { page: pagination.currentPage, limit: 10 };
			if (activeTab === 'pending') {
				const response = await getPendingSellers(params);
				if (response.success) {
					setPendingSellers(response.data);
					setPagination(response.pagination);
				} else if (handleAdminAuthError(response)) {
					return;
				}
			} else {
				const response = await getSellerDocs(params);
				if (response.success) {
					setSellerDocs(response.data);
					setPagination(response.pagination);
				} else if (handleAdminAuthError(response)) {
					return;
				}
			}
		} catch (error) {
			console.error('Erro ao carregar dados:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadData();
	}, [activeTab, pagination.currentPage]);

	const handleVerifySeller = async (sellerId, isVerified) => {
		try {
			const response = await verifySeller(sellerId, isVerified);
			if (response.success) {
				notyf.success(isVerified ? 'Vendedor verificado!' : 'Verificação removida!');
				loadData();
			} else if (handleAdminAuthError(response)) {
				return;
			}
		} catch (error) {
			notyf.error('Erro ao verificar vendedor');
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold text-gray-900">Vendedores</h1>
				<p className="text-gray-600 mt-1">Gerencie verificação de vendedores</p>
			</div>

			{/* Tabs */}
			<div className="flex gap-4 border-b border-gray-200">
				<button
					onClick={() => { setActiveTab('pending'); setPagination({ ...pagination, currentPage: 1 }); }}
					className={`pb-3 px-4 font-medium transition-colors ${
						activeTab === 'pending'
							? 'text-[#154c9a] border-b-2 border-[#154c9a]'
							: 'text-gray-500 hover:text-gray-700'
					}`}
				>
					Pendentes de Verificação
				</button>
				<button
					onClick={() => { setActiveTab('docs'); setPagination({ ...pagination, currentPage: 1 }); }}
					className={`pb-3 px-4 font-medium transition-colors ${
						activeTab === 'docs'
							? 'text-[#154c9a] border-b-2 border-[#154c9a]'
							: 'text-gray-500 hover:text-gray-700'
					}`}
				>
					Documentos
				</button>
			</div>

			{/* Conteúdo */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
				{loading ? (
					<div className="flex items-center justify-center py-20"><Loader2 className="w-12 h-12 text-[#154c9a] animate-spin" /></div>
				) : activeTab === 'pending' ? (
					pendingSellers.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-20">
							<UserCheck className="w-16 h-16 text-green-300 mb-4" />
							<p className="text-gray-500 text-lg">Nenhum vendedor pendente</p>
						</div>
					) : (
						<table className="w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendedor</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contato</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Localização</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Registro</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{pendingSellers.map((seller) => (
									<tr key={seller.id} className="hover:bg-gray-50">
										<td className="px-6 py-4">
											<p className="font-medium text-gray-900">{seller.name} {seller.surname}</p>
											<p className="text-sm text-gray-500">{seller.email}</p>
										</td>
										<td className="px-6 py-4 text-sm text-gray-900">{seller.phone || 'N/A'}</td>
										<td className="px-6 py-4 text-sm text-gray-900">{seller.provincia || 'N/A'}</td>
										<td className="px-6 py-4 text-sm text-gray-500">{new Date(seller.createdAt).toLocaleDateString('pt-BR')}</td>
										<td className="px-6 py-4">
											<div className="flex items-center gap-2">
												<button
													onClick={() => handleVerifySeller(seller.id, true)}
													className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
													title="Verificar"
												>
													<CheckCircle className="w-5 h-5" />
												</button>
												<button
													onClick={() => handleVerifySeller(seller.id, false)}
													className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
													title="Rejeitar"
												>
													<XCircle className="w-5 h-5" />
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)
				) : (
					sellerDocs.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-20">
							<FileText className="w-16 h-16 text-gray-300 mb-4" />
							<p className="text-gray-500 text-lg">Nenhum documento encontrado</p>
						</div>
					) : (
						<table className="w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documento</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendedor</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{sellerDocs.map((doc) => (
									<tr key={doc.id} className="hover:bg-gray-50">
										<td className="px-6 py-4 text-sm text-gray-900">{doc.documentType}</td>
										<td className="px-6 py-4">
											<p className="text-sm font-medium text-gray-900">{doc.user.name} {doc.user.surname}</p>
											<p className="text-xs text-gray-500">{doc.user.email}</p>
										</td>
										<td className="px-6 py-4 text-sm text-gray-900">{doc.type}</td>
										<td className="px-6 py-4">
											<a href={doc.documentUrl} target="_blank" rel="noopener noreferrer" className="text-[#154c9a] hover:underline text-sm">
												Ver documento
											</a>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)
				)}
			</div>

			{pagination.totalPages > 1 && (
				<div className="flex items-center justify-center gap-2">
					<button onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })} disabled={pagination.currentPage === 1} className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50">Anterior</button>
					<span className="text-sm text-gray-600">Página {pagination.currentPage} de {pagination.totalPages}</span>
					<button onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })} disabled={pagination.currentPage === pagination.totalPages} className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50">Próxima</button>
				</div>
			)}
		</div>
	);
};

export default AdminSellers;
