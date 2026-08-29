import React, { useEffect, useRef, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import useChatStore from '../../stores/chatStore';
import useAuthStore from '../../stores/authStore';
import { getSocket } from '../../services/socket';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

export default function ChatConversation({ conversationId }) {
	const { user } = useAuthStore();
	const {
		messages,
		messagesLoading,
		fetchMessages,
		typingUsers,
		conversations,
		onlineUsers,
		markAsRead,
	} = useChatStore();

	const convMessages = messages[conversationId] || [];
	const conversation = conversations.find((c) => c.id === conversationId);
	const otherParticipant = conversation?.participants?.find(
		(p) => p.user.id !== user?.id
	);
	const isAdmin = otherParticipant?.user?.role === 'ADMIN';
	const isOnline = !!otherParticipant && !isAdmin && !!onlineUsers[otherParticipant.user.id];
	const otherName = otherParticipant
		? isAdmin ? 'Caxiauto' : `${otherParticipant.user.name} ${otherParticipant.user.surname}`
		: 'Carregando...';

	const scrollRef = useRef(null);
	const stickToBottom = useRef(true);
	const [hasMore, setHasMore] = React.useState(true);
	const [nextCursor, setNextCursor] = React.useState(null);
	const [loadingMore, setLoadingMore] = React.useState(false);

	useEffect(() => {
		if (conversationId) {
			fetchMessages(conversationId).then((pagination) => {
				if (pagination) {
					setHasMore(pagination.hasMore);
					setNextCursor(pagination.nextCursor);
				}
			});
			markAsRead(conversationId);
		}
	}, [conversationId, fetchMessages, markAsRead]);

	useEffect(() => {
		const el = scrollRef.current;
		if (el && stickToBottom.current && !loadingMore) {
			el.scrollTop = el.scrollHeight;
		}
	}, [convMessages.length, loadingMore]);

	useEffect(() => {
		const socket = getSocket();
		if (socket && conversationId) {
			socket.emit('join_conversation', { conversationId });
			return () => {
				socket.emit('leave_conversation', { conversationId });
			};
		}
	}, [conversationId]);

	const handleScroll = useCallback(() => {
		const el = scrollRef.current;
		if (el) {
			stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
		}
		if (el && el.scrollTop === 0 && hasMore && !loadingMore) {
			setLoadingMore(true);
			fetchMessages(conversationId, nextCursor).then((pagination) => {
				if (pagination) {
					setHasMore(pagination.hasMore);
					setNextCursor(pagination.nextCursor);
				}
				setLoadingMore(false);
			});
		}
	}, [conversationId, hasMore, loadingMore, nextCursor, fetchMessages]);

	const typingUser = typingUsers[conversationId];

	return (
		<div className="flex flex-col h-full">
			<div className="flex items-center gap-3 px-5 py-3 border-b border-[#e5e7eb] bg-white">
				<div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-[#eef3fa] flex items-center justify-center">
					{isAdmin ? (
						<img src="/images/logos/iconBG.png" alt="Caxiauto" className="w-full h-full object-cover" />
					) : (
						<span className="text-[#154c9a] font-display font-bold text-xs">
							{otherParticipant
								? `${otherParticipant.user.name.charAt(0)}${otherParticipant.user.surname.charAt(0)}`
								: '??'}
						</span>
					)}
					{isOnline && (
						<span
							className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"
							title="Online"
						/>
					)}
				</div>
				<div>
					<span className="font-display font-bold text-sm text-[#111827]">
						{otherName}
						{isOnline && <span className="font-body text-xs font-normal text-emerald-600 ml-2">● online</span>}
					</span>
					{conversation?.vehicle && (
						<p className="font-body text-xs text-[#6b7280]">{conversation.vehicle.name}</p>
					)}
					{conversation?.peca && (
						<p className="font-body text-xs text-[#6b7280]">{conversation.peca.name}</p>
					)}
				</div>
			</div>

			<div
				ref={scrollRef}
				onScroll={handleScroll}
				className="flex-1 overflow-y-auto px-5 py-4 space-y-1"
			>
				{loadingMore && (
					<div className="flex justify-center py-2">
						<Loader2 className="w-4 h-4 text-[#9ca3af] animate-spin" />
					</div>
				)}

				{messagesLoading && convMessages.length === 0 ? (
					<div className="flex items-center justify-center h-full">
						<Loader2 className="w-6 h-6 text-[#154c9a] animate-spin" />
					</div>
				) : convMessages.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-full text-center px-6">
						<p className="font-body text-sm text-[#6b7280]">Nenhuma mensagem ainda</p>
						<p className="font-body text-xs text-[#9ca3af] mt-1">
							Envie a primeira mensagem para iniciar a conversa
						</p>
					</div>
				) : (
					convMessages.map((msg) => (
						<ChatMessage
							key={msg.id}
							message={msg}
							isOwn={msg.senderId === user?.id}
						/>
					))
				)}

				{typingUser && (
					<div className="flex justify-start mb-2">
						<div className="bg-[#f5f5f5] mr-2 rounded-l-2xl rounded-tr-2xl px-4 py-2.5">
							<p className="font-body text-sm text-[#6b7280] italic">{isAdmin ? 'Caxiauto' : otherName} está a escrever...</p>
						</div>
					</div>
				)}
			</div>

			<ChatInput conversationId={conversationId} />
		</div>
	);
}
