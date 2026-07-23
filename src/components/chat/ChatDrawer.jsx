import React, { useEffect } from 'react';
import { X, MessageSquare, ArrowLeft } from 'lucide-react';
import useChatStore from '../../stores/chatStore';
import useAuthStore from '../../stores/authStore';
import ChatConversationList from './ChatConversationList';
import ChatConversation from './ChatConversation';

export default function ChatDrawer() {
	const { user } = useAuthStore();
	const {
		isChatOpen,
		activeConversationId,
		setActiveConversation,
		closeChat,
		fetchConversations,
	} = useChatStore();

	useEffect(() => {
		if (isChatOpen && user) {
			fetchConversations();
		}
	}, [isChatOpen, user, fetchConversations]);

	if (!isChatOpen) return null;

	return (
		<>
			<div
				className="fixed inset-0 bg-black/50 z-40 lg:hidden"
				onClick={closeChat}
			/>
			<div
				className={`fixed top-0 right-0 z-50 h-full w-full sm:w-96 bg-white border-l border-[#e5e7eb] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
					isChatOpen ? 'translate-x-0' : 'translate-x-full'
				}`}
			>
				<div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e7eb] bg-white">
					<div className="flex items-center gap-3">
						{activeConversationId && (
							<button
								onClick={() => setActiveConversation(null)}
								className="p-1.5 hover:bg-[#f8f6f2] rounded-lg transition-colors cursor-pointer"
								aria-label="Voltar"
							>
								<ArrowLeft className="w-5 h-5 text-[#6b7280]" />
							</button>
						)}
						<h2 className="text-lg font-display font-bold text-[#111827]">Mensagens</h2>
					</div>
					<button
						onClick={closeChat}
						className="p-1.5 hover:bg-[#f8f6f2] rounded-lg transition-colors cursor-pointer"
						aria-label="Fechar"
					>
						<X className="w-5 h-5 text-[#6b7280]" />
					</button>
				</div>

				<div className="flex-1 overflow-hidden">
					{activeConversationId ? (
						<ChatConversation conversationId={activeConversationId} />
					) : (
						<ChatConversationList />
					)}
				</div>
			</div>
		</>
	);
}
