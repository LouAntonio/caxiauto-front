import { create } from 'zustand';
import api, { notyf } from '../services/api';
import { connectSocket, disconnectSocket, getSocket } from '../services/socket';
import useAuthStore from './authStore';

const useChatStore = create((set, get) => ({
	conversations: [],
	activeConversationId: null,
	messages: {},
	unreadCount: 0,
	isChatOpen: false,
	isConnected: false,
	typingUsers: {},
	loading: false,
	messagesLoading: false,

	initSocket: (token) => {
		const socket = connectSocket(token);

		socket.on('connect', () => {
			set({ isConnected: true });
		});

		socket.on('disconnect', () => {
			set({ isConnected: false });
		});

		socket.on('new_message', (message) => {
			const { messages, activeConversationId } = get();
			const convMessages = messages[message.conversationId] || [];

			set({
				messages: {
					...messages,
					[message.conversationId]: [...convMessages, message],
				},
			});

			// Atualizar preview na lista de conversas
			const conversations = get().conversations.map((c) => {
				if (c.id === message.conversationId) {
					return { ...c, messages: [message], updatedAt: message.createdAt };
				}
				return c;
			});
			set({ conversations });
		});

		socket.on('messages_read', ({ conversationId, userId }) => {
			const { messages, activeConversationId } = get();
			const convMessages = (messages[conversationId] || []).map((m) => {
				if (m.senderId !== userId && !m.readAt) {
					return { ...m, readAt: new Date().toISOString() };
				}
				return m;
			});
			set({
				messages: { ...messages, [conversationId]: convMessages },
			});
		});

		socket.on('unread_count', ({ count }) => {
			set({ unreadCount: count });
		});

		socket.on('typing', ({ conversationId }) => {
			const conversations = get().conversations;
			const conv = conversations.find((c) => c.id === conversationId);
			if (!conv) return;
			const currentUserId = useAuthStore.getState().user?.id;
			const otherUser = conv.participants.find((p) => p.user.id !== currentUserId);
			const typingName = otherUser?.user?.role === 'ADMIN'
				? 'Caxiauto está a escrever...'
				: otherUser
					? `${otherUser.user.name} ${otherUser.user.surname} está a escrever...`
					: '';

			set({
				typingUsers: {
					...get().typingUsers,
					[conversationId]: typingName,
				},
			});
		});

		socket.on('stop_typing', ({ conversationId }) => {
			const { typingUsers } = get();
			const updated = { ...typingUsers };
			delete updated[conversationId];
			set({ typingUsers: updated });
		});
	},

	destroySocket: () => {
		const socket = getSocket();
		if (socket) {
			socket.off('new_message');
			socket.off('messages_read');
			socket.off('unread_count');
			socket.off('typing');
			socket.off('stop_typing');
		}
		disconnectSocket();
		set({ isConnected: false, conversations: [], messages: {}, unreadCount: 0 });
	},

	fetchConversations: async () => {
		set({ loading: true });
		try {
			const res = await api.listConversations();
			if (res.success) {
				set({ conversations: res.data });
				// Calcular total não lidas
				const totalUnread = res.data.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
				set({ unreadCount: totalUnread });

				// Entrar nas salas das conversas
				const socket = getSocket();
				if (socket) {
					res.data.forEach((c) => {
						socket.emit('join_conversation', { conversationId: c.id });
					});
				}
			}
		} catch (error) {
			console.error('Erro ao buscar conversas:', error);
		} finally {
			set({ loading: false });
		}
	},

	fetchMessages: async (conversationId, cursor = null) => {
		set({ messagesLoading: true });
		try {
			const res = await api.getMessages(conversationId, cursor);
			if (res.success) {
				const existing = get().messages[conversationId] || [];
				const newMessages = cursor ? [...res.data, ...existing] : res.data;

				// Deduplicar por id
				const seen = new Set();
				const deduped = newMessages.filter((m) => {
					if (seen.has(m.id)) return false;
					seen.add(m.id);
					return true;
				});

				set({
					messages: { ...get().messages, [conversationId]: deduped },
				});

				return res.pagination;
			}
		} catch (error) {
			console.error('Erro ao buscar mensagens:', error);
		} finally {
			set({ messagesLoading: false });
		}
	},

	createConversation: async (participantId = null, vehicleId = null, pecaId = null) => {
		try {
			const body = { vehicleId, pecaId };
			if (participantId) body.participantId = participantId;
			const res = await api.createConversation(body);
			if (res.success) {
				const socket = getSocket();
				if (socket) {
					socket.emit('join_conversation', { conversationId: res.data.id });
				}
				await get().fetchConversations();
				set({ activeConversationId: res.data.id, isChatOpen: true });
				return { success: true, data: res.data };
			}
			notyf.error(res.message || 'Erro ao criar conversa');
			return { success: false, message: res.message };
		} catch (error) {
			notyf.error('Erro ao criar conversa');
			return { success: false, message: 'Erro ao criar conversa' };
		}
	},

	sendMessage: async (conversationId, text) => {
		const socket = getSocket();
		if (!socket?.connected) return { success: false, message: 'Sem conexão' };

		return new Promise((resolve) => {
			socket.emit('send_message', { conversationId, text }, (response) => {
				resolve(response);
			});
		});
	},

	markAsRead: async (conversationId) => {
		try {
			await api.markAsRead(conversationId);
			const socket = getSocket();
			if (socket) {
				socket.emit('mark_read', { conversationId });
			}

			// Atualizar local unreadCount
			const conversations = get().conversations.map((c) => {
				if (c.id === conversationId) {
					return { ...c, unreadCount: 0 };
				}
				return c;
			});
			const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
			set({ conversations, unreadCount: totalUnread });
		} catch (error) {
			console.error('Erro ao marcar como lidas:', error);
		}
	},

	emitTyping: (conversationId) => {
		const socket = getSocket();
		if (socket) socket.emit('typing', { conversationId });
	},

	emitStopTyping: (conversationId) => {
		const socket = getSocket();
		if (socket) socket.emit('stop_typing', { conversationId });
	},

	setActiveConversation: (id) => {
		set({ activeConversationId: id });
		if (id) {
			get().markAsRead(id);
		}
	},

	openChat: () => set({ isChatOpen: true }),
	closeChat: () => set({ isChatOpen: false, activeConversationId: null }),
}));

export default useChatStore;
