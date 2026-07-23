import React, { useEffect } from 'react';
import { MessageSquare, Loader2, ArrowLeft } from 'lucide-react';
import useChatStore from '../../stores/chatStore';
import useAuthStore from '../../stores/authStore';
import ChatMessage from '../../components/chat/ChatMessage';
import ChatInput from '../../components/chat/ChatInput';

function formatTime(dateStr) {
	if (!dateStr) return '';
	const date = new Date(dateStr);
	const now = new Date();
	const diff = now - date;
	const mins = Math.floor(diff / 60000);
	const hours = Math.floor(diff / 3600000);
	const days = Math.floor(diff / 86400000);

	if (mins < 1) return 'Agora';
	if (mins < 60) return `há ${mins}min`;
	if (hours < 24) return `há ${hours}h`;
	if (days < 7) return `há ${days}d`;
	return date.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' });
}

export default function Mensagens() {
	const { user } = useAuthStore();
	const {
		conversations,
		activeConversationId,
		messages,
		messagesLoading,
		loading,
		fetchConversations,
		fetchMessages,
		setActiveConversation,
		markAsRead,
		typingUsers,
	} = useChatStore();

	useEffect(() => {
		fetchConversations();
	}, [fetchConversations]);

	useEffect(() => {
		if (activeConversationId) {
			fetchMessages(activeConversationId);
			markAsRead(activeConversationId);
		}
	}, [activeConversationId, fetchMessages, markAsRead]);

	const activeConv = conversations.find((c) => c.id === activeConversationId);
	const otherParticipant = activeConv?.participants?.find((p) => p.user.id !== user?.id);
	const otherIsAdmin = otherParticipant?.user?.role === 'ADMIN';
	const otherName = otherParticipant
		? otherIsAdmin ? 'Caxiauto' : `${otherParticipant.user.name} ${otherParticipant.user.surname}`
		: '';

	const convMessages = messages[activeConversationId] || [];
	const typingUser = typingUsers[activeConversationId];

	return (
		<div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
			<div className="grid grid-cols-1 md:grid-cols-3 h-full">
				{/* Sidebar - Lista de Conversas */}
				<div className={`md:col-span-1 border-r border-[#e5e7eb] ${activeConversationId ? 'hidden md:block' : 'block'}`}>
					<div className="p-4 border-b border-[#e5e7eb]">
						<h3 className="font-display font-bold text-[#111827]">Conversas</h3>
					</div>
					<div className="overflow-y-auto" style={{ height: 'calc(100% - 57px)' }}>
						{loading ? (
							<div className="flex items-center justify-center py-20">
								<Loader2 className="w-6 h-6 text-[#154c9a] animate-spin" />
							</div>
						) : conversations.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-20 px-6 text-center">
								<div className="w-14 h-14 bg-[#eef3fa] rounded-full flex items-center justify-center mb-3">
									<MessageSquare className="w-7 h-7 text-[#154c9a]" />
								</div>
								<p className="text-[#6b7280] font-body text-sm">Nenhuma conversa</p>
							</div>
						) : (
							conversations.map((conv) => {
								const other = conv.participants?.find((p) => p.user.id !== user?.id);
								const pu = other?.user;
								const lastMsg = conv.messages?.[0];
								const convIsAdmin = pu?.role === 'ADMIN';
								const displayName = convIsAdmin ? 'Caxiauto' : pu ? `${pu.name} ${pu.surname}` : 'Desconhecido';

								return (
									<button
										key={conv.id}
										onClick={() => setActiveConversation(conv.id)}
										className={`w-full flex items-start gap-3 px-4 py-3.5 hover:bg-[#f8f6f2] transition-colors border-b border-[#e5e7eb] text-left cursor-pointer ${
											activeConversationId === conv.id ? 'bg-[#eef3fa]' : ''
										}`}
									>
										<div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-[#eef3fa] flex items-center justify-center">
											{convIsAdmin ? (
												<img src="/images/logos/iconBG.png" alt="Caxiauto" className="w-full h-full object-cover" />
											) : (
												<span className="text-[#154c9a] font-display font-bold text-sm">
													{pu ? `${pu.name.charAt(0)}${pu.surname.charAt(0)}` : '??'}
												</span>
											)}
										</div>
										<div className="flex-1 min-w-0">
											<div className="flex items-center justify-between gap-2">
												<span className="font-body font-semibold text-sm text-[#111827] truncate">
													{displayName}
												</span>
												<span className="font-body text-xs text-[#9ca3af] flex-shrink-0">
													{formatTime(lastMsg?.createdAt)}
												</span>
											</div>
											<p className="font-body text-sm text-[#6b7280] truncate mt-0.5">
												{lastMsg?.text || 'Clique para começar'}
											</p>
										</div>
										{(conv.unreadCount || 0) > 0 && (
											<span className="bg-[#d41120] text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 flex-shrink-0 mt-1">
												{conv.unreadCount}
											</span>
										)}
									</button>
								);
							})
						)}
					</div>
				</div>

				{/* Painel de Chat */}
				<div className={`md:col-span-2 flex flex-col ${!activeConversationId ? 'hidden md:flex' : 'flex'}`}>
					{activeConversationId && activeConv ? (
						<>
							<div className="flex items-center gap-3 px-5 py-3.5 border-b border-[#e5e7eb] bg-white">
								<button
									onClick={() => setActiveConversation(null)}
									className="md:hidden p-1.5 hover:bg-[#f8f6f2] rounded-lg transition-colors cursor-pointer"
								>
									<ArrowLeft className="w-5 h-5 text-[#6b7280]" />
								</button>
								<div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-[#eef3fa] flex items-center justify-center">
									{otherIsAdmin ? (
										<img src="/images/logos/iconBG.png" alt="Caxiauto" className="w-full h-full object-cover" />
									) : (
										<span className="text-[#154c9a] font-display font-bold text-xs">
											{otherParticipant
												? `${otherParticipant.user.name.charAt(0)}${otherParticipant.user.surname.charAt(0)}`
												: '??'}
										</span>
									)}
								</div>
								<div>
									<span className="font-display font-bold text-sm text-[#111827]">{otherName}</span>
									{activeConv?.vehicle && (
										<p className="font-body text-xs text-[#6b7280]">{activeConv.vehicle.name}</p>
									)}
									{activeConv?.peca && (
										<p className="font-body text-xs text-[#6b7280]">{activeConv.peca.name}</p>
									)}
								</div>
							</div>
							<div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
								{messagesLoading && convMessages.length === 0 ? (
									<div className="flex items-center justify-center h-full">
										<Loader2 className="w-6 h-6 text-[#154c9a] animate-spin" />
									</div>
								) : convMessages.length === 0 ? (
									<div className="flex flex-col items-center justify-center h-full text-center px-6">
										<p className="font-body text-sm text-[#6b7280]">Nenhuma mensagem ainda</p>
										<p className="font-body text-xs text-[#9ca3af] mt-1">Envie a primeira mensagem</p>
									</div>
								) : (
									convMessages.map((msg) => (
										<ChatMessage key={msg.id} message={msg} isOwn={msg.senderId === user?.id} />
									))
								)}
								{typingUser && (
									<div className="flex justify-start mb-2">
										<div className="bg-[#f5f5f5] rounded-l-2xl rounded-tr-2xl px-4 py-2.5">
											<p className="font-body text-sm text-[#6b7280] italic">{otherIsAdmin ? 'Caxiauto' : otherName} está a escrever...</p>
										</div>
									</div>
								)}
							</div>
							<ChatInput conversationId={activeConversationId} />
						</>
					) : (
						<div className="hidden md:flex flex-col items-center justify-center h-full text-center px-6">
							<div className="w-20 h-20 bg-[#eef3fa] rounded-full flex items-center justify-center mb-4">
								<MessageSquare className="w-10 h-10 text-[#154c9a]" />
							</div>
							<p className="font-display font-bold text-lg text-[#111827]">As suas mensagens</p>
							<p className="font-body text-sm text-[#6b7280] mt-1">
								Selecione uma conversa para começar
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
