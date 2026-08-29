import { create } from 'zustand';
import api, { notyf } from '../services/api';
import { connectSocket, disconnectSocket, getSocket } from '../services/socket';

// Timers de "a escrever..." por conversa (TTL — evita indicador preso se o
// stop_typing se perder durante uma reconexão).
const typingTimers = new Map();
const TYPING_TTL_MS = 10000;

const clearTypingTimer = (conversationId) => {
	const timer = typingTimers.get(conversationId);
	if (timer) {
		clearTimeout(timer);
		typingTimers.delete(conversationId);
	}
};

const useChatStore = create((set, get) => ({
	conversations: [],
	activeConversationId: null,
	messages: {},
	unreadCount: 0,
	isChatOpen: false,
	isConnected: false,
	typingUsers: {},
	onlineUsers: {},
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
			const { messages } = get();
			const convMessages = messages[message.conversationId] || [];

			// Deduplicar: evita duplicado se a mensagem também veio numa resposta REST
			if (convMessages.some((m) => m.id === message.id)) return;

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
			const { messages } = get();
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
			set({
				typingUsers: {
					...get().typingUsers,
					[conversationId]: true,
				},
			});

			// TTL: o indicador apaga-se sozinho se não chegar stop_typing
			clearTypingTimer(conversationId);
			typingTimers.set(
				conversationId,
				setTimeout(() => {
					typingTimers.delete(conversationId);
					const { typingUsers } = get();
					if (typingUsers[conversationId]) {
						const updated = { ...typingUsers };
						delete updated[conversationId];
						set({ typingUsers: updated });
					}
				}, TYPING_TTL_MS)
			);
		});

		socket.on('stop_typing', ({ conversationId }) => {
			clearTypingTimer(conversationId);
			const { typingUsers } = get();
			const updated = { ...typingUsers };
			delete updated[conversationId];
			set({ typingUsers: updated });
		});

		socket.on('user_online', ({ userId }) => {
			set({ onlineUsers: { ...get().onlineUsers, [userId]: true } });
		});

		socket.on('user_offline', ({ userId }) => {
			const { onlineUsers } = get();
			if (onlineUsers[userId]) {
				const updated = { ...onlineUsers };
				delete updated[userId];
				set({ onlineUsers: updated });
			}
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
			socket.off('user_online');
			socket.off('user_offline');
		}
		for (const conversationId of typingTimers.keys()) clearTypingTimer(conversationId);
		disconnectSocket();
		set({ isConnected: false, conversations: [], messages: {}, unreadCount: 0, onlineUsers: {} });
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
		} catch {
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
