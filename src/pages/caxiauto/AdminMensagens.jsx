import React, { useState } from 'react';
import { MessageSquare, User, Car, Wrench, Clock, CheckCheck, ChevronLeft, ExternalLink } from 'lucide-react';
import { useAdminConversations } from '../../hooks/queries/useAdmin';
import { getImageUrl } from '../../services/api';
import { Link } from 'react-router-dom';
import { AdminTableSkeleton } from '../../components/skeletons';

const AdminMensagens = () => {
	const { data: conversations, isLoading } = useAdminConversations();
	const [selectedConv, setSelectedConv] = useState(null);

	const formatDate = (dateStr) => {
		const date = new Date(dateStr);
		const now = new Date();
		const diffMs = now - date;
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return 'Agora';
		if (diffMins < 60) return `${diffMins} min`;
		if (diffHours < 24) return `${diffHours}h`;
		if (diffDays < 7) return `${diffDays}d`;
		return date.toLocaleDateString('pt-PT');
	};

	if (isLoading) {
		return <AdminTableSkeleton />;
	}

	const detail = selectedConv
		? conversations.find((c) => c.id === selectedConv)
		: null;

	if (detail) {
		const client = detail.participants?.find((p) => p.user.role !== 'ADMIN');
		const admins = detail.participants?.filter((p) => p.user.role === 'ADMIN');
		const lastMsg = detail.messages?.[0];

		return (
			<div>
				<button
					onClick={() => setSelectedConv(null)}
					className="flex items-center gap-2 text-gray-600 hover:text-[#154c9a] mb-6 transition-colors"
				>
					<ChevronLeft className="w-5 h-5" />
					<span className="font-medium">Voltar</span>
				</button>

				<div className="bg-white rounded-2xl border border-gray-200 p-6">
					<div className="flex items-start justify-between mb-6">
						<div>
							<h3 className="text-lg font-bold text-gray-900">Conversa</h3>
							{client && (
								<p className="text-sm text-gray-500 mt-1">
									Cliente: {client.user.name} {client.user.surname}
								</p>
							)}
							{admins?.length > 0 && (
								<p className="text-sm text-gray-500">
									Admin: {admins.map((a) => `${a.user.name} ${a.user.surname}`).join(', ')}
								</p>
							)}
						</div>
						{detail.totalUnread > 0 && (
							<span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full">
								{detail.totalUnread} não lida{detail.totalUnread > 1 ? 's' : ''}
							</span>
						)}
					</div>

					{detail.vehicle && (
						<Link
							to={`/caxiauto/veiculos`}
							className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-4 hover:bg-gray-100 transition-colors"
						>
							<div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
								{detail.vehicle.image ? (
									<img src={getImageUrl(detail.vehicle.image)} alt={detail.vehicle.name} className="w-full h-full object-cover" />
								) : (
									<div className="w-full h-full flex items-center justify-center">
										<Car className="w-5 h-5 text-gray-400" />
									</div>
								)}
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-sm font-medium text-gray-900 truncate">{detail.vehicle.name}</p>
								<p className="text-xs text-gray-500">Veículo</p>
							</div>
							<ExternalLink className="w-4 h-4 text-gray-400" />
						</Link>
					)}

					{detail.peca && (
						<Link
							to={`/caxiauto/pecas`}
							className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-4 hover:bg-gray-100 transition-colors"
						>
							<div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
								{detail.peca.image ? (
									<img src={getImageUrl(detail.peca.image)} alt={detail.peca.name} className="w-full h-full object-cover" />
								) : (
									<div className="w-full h-full flex items-center justify-center">
										<Wrench className="w-5 h-5 text-gray-400" />
									</div>
								)}
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-sm font-medium text-gray-900 truncate">{detail.peca.name}</p>
								<p className="text-xs text-gray-500">Peça</p>
							</div>
							<ExternalLink className="w-4 h-4 text-gray-400" />
						</Link>
					)}

					{lastMsg && (
						<div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
							<p className="text-xs text-gray-500 mb-1">Última mensagem</p>
							<p className="text-sm text-gray-800">{lastMsg.text}</p>
							<p className="text-xs text-gray-400 mt-1">
								{new Date(lastMsg.createdAt).toLocaleString('pt-PT')}
							</p>
						</div>
					)}
				</div>
			</div>
		);
	}

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<div>
					<h2 className="text-2xl font-bold text-gray-900">Mensagens</h2>
					<p className="text-sm text-gray-500 mt-1">
						{conversations?.length || 0} conversa{(conversations?.length || 0) !== 1 ? 's' : ''} no total
					</p>
				</div>
			</div>

			{!conversations?.length ? (
				<div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
					<MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
					<h3 className="text-lg font-medium text-gray-500">Nenhuma conversa</h3>
					<p className="text-sm text-gray-400 mt-1">As conversas dos clientes aparecerão aqui.</p>
				</div>
			) : (
				<div className="space-y-3">
					{conversations.map((conv) => {
						const client = conv.participants?.find((p) => p.user.role !== 'ADMIN');
						const lastMsg = conv.messages?.[0];
						const hasUnread = conv.totalUnread > 0;

						return (
							<button
								key={conv.id}
								onClick={() => setSelectedConv(conv.id)}
								className={`w-full text-left bg-white rounded-2xl border p-4 transition-all hover:shadow-md ${
									hasUnread ? 'border-l-4 border-l-[#154c9a] border-gray-200' : 'border-gray-200'
								}`}
							>
								<div className="flex items-start gap-4">
									<div className="w-10 h-10 bg-[#154c9a]/10 rounded-full flex items-center justify-center flex-shrink-0">
										<User className="w-5 h-5 text-[#154c9a]" />
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-center justify-between gap-2">
											<p className={`font-medium truncate ${hasUnread ? 'text-gray-900' : 'text-gray-700'}`}>
												{client ? `${client.user.name} ${client.user.surname}` : 'Desconhecido'}
											</p>
											<div className="flex items-center gap-2 flex-shrink-0">
												{hasUnread && (
													<span className="bg-[#d41120] text-white text-xs font-bold px-2 py-0.5 rounded-full">
														{conv.totalUnread}
													</span>
												)}
												<span className="text-xs text-gray-400">{formatDate(conv.updatedAt)}</span>
											</div>
										</div>
										<div className="flex items-center gap-2 mt-1">
											{lastMsg ? (
												<p className={`text-sm truncate flex-1 ${hasUnread ? 'text-gray-600 font-medium' : 'text-gray-500'}`}>
													{lastMsg.text}
												</p>
											) : (
												<p className="text-sm text-gray-400 italic">Sem mensagens</p>
											)}
										</div>
										<div className="flex items-center gap-3 mt-2">
											{conv.vehicle && (
												<span className="flex items-center gap-1 text-xs text-gray-400">
													<Car className="w-3 h-3" />
													{conv.vehicle.name}
												</span>
											)}
											{conv.peca && (
												<span className="flex items-center gap-1 text-xs text-gray-400">
													<Wrench className="w-3 h-3" />
													{conv.peca.name}
												</span>
											)}
											{client?.user?.email && (
												<span className="text-xs text-gray-400">{client.user.email}</span>
											)}
										</div>
									</div>
								</div>
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default AdminMensagens;
