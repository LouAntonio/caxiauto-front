import React from 'react';
import { MessageSquare, Loader2 } from 'lucide-react';
import useChatStore from '../../stores/chatStore';
import useAuthStore from '../../stores/authStore';

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

export default function ChatConversationList() {
	const { user } = useAuthStore();
	const { conversations, loading, setActiveConversation, markAsRead } = useChatStore();

	if (loading) {
		return (
			<div className="flex items-center justify-center h-full py-20">
				<Loader2 className="w-6 h-6 text-[#154c9a] animate-spin" />
			</div>
		);
	}

	if (conversations.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-full py-20 px-6 text-center">
				<div className="w-16 h-16 bg-[#eef3fa] rounded-full flex items-center justify-center mb-4">
					<MessageSquare className="w-8 h-8 text-[#154c9a]" />
				</div>
				<p className="text-[#6b7280] font-body text-sm">Nenhuma conversa ainda</p>
				<p className="text-[#9ca3af] font-body text-xs mt-1">
					Inicie uma conversa a partir de um anúncio
				</p>
			</div>
		);
	}

	return (
		<div className="overflow-y-auto h-full">
			{conversations.map((conv) => {
		const otherParticipant = conv.participants?.find(
				(p) => p.user.id !== user?.id
			);
				const participantUser = otherParticipant?.user;
				const lastMsg = conv.messages?.[0];
				const isAdmin = participantUser?.role === 'ADMIN';
				const displayName = isAdmin ? 'Caxiauto' : participantUser
					? `${participantUser.name} ${participantUser.surname}`
					: 'Desconhecido';

				return (
					<button
						key={conv.id}
						onClick={() => {
							setActiveConversation(conv.id);
							markAsRead(conv.id);
						}}
						className="w-full flex items-start gap-3 px-5 py-4 hover:bg-[#f8f6f2] transition-colors border-b border-[#e5e7eb] text-left cursor-pointer"
					>
						<div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-[#eef3fa] flex items-center justify-center">
							{isAdmin ? (
								<img src="/images/logos/iconBG.png" alt="Caxiauto" className="w-full h-full object-cover" />
							) : (
								<span className="text-[#154c9a] font-display font-bold text-sm">
									{participantUser ? `${participantUser.name.charAt(0)}${participantUser.surname.charAt(0)}` : '??'}
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
								{lastMsg?.text || 'Clique para começar a conversar'}
							</p>
						</div>
						{(conv.unreadCount || 0) > 0 && (
							<span className="bg-[#d41120] text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 flex-shrink-0 mt-1">
								{conv.unreadCount}
							</span>
						)}
					</button>
				);
			})}
		</div>
	);
}
