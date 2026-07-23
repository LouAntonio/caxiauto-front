import React from 'react';
import { MessageSquare, X } from 'lucide-react';
import useChatStore from '../../stores/chatStore';
import useAuthStore from '../../stores/authStore';

export default function ChatButton() {
	const { user } = useAuthStore();
	const { isChatOpen, unreadCount, openChat, closeChat } = useChatStore();

	if (!user) return null;

	return (
		<button
			onClick={isChatOpen ? closeChat : openChat}
			className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#154c9a] hover:bg-[#123f80] text-white rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center cursor-pointer"
			aria-label={isChatOpen ? 'Fechar chat' : 'Abrir chat'}
		>
			{isChatOpen ? (
				<X className="w-6 h-6" />
			) : (
				<>
					<MessageSquare className="w-6 h-6" />
					{unreadCount > 0 && (
						<span className="absolute -top-1 -right-1 bg-[#d41120] text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center shadow-md">
							{unreadCount > 99 ? '99+' : unreadCount}
						</span>
					)}
				</>
			)}
		</button>
	);
}
