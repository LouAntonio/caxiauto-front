import { io } from 'socket.io-client';
import { API_URL } from './axios';

let socket = null;

export const connectSocket = (token) => {
	if (socket?.connected) return socket;

	socket = io(API_URL, {
		auth: { token },
		transports: ['websocket', 'polling'],
		reconnection: true,
		reconnectionAttempts: 10,
		reconnectionDelay: 1000,
	});

	socket.on('connect', () => {
		console.log('[Socket] Conectado:', socket.id);
	});

	socket.on('disconnect', (reason) => {
		console.log('[Socket] Desconectado:', reason);
	});

	socket.on('connect_error', (error) => {
		console.error('[Socket] Erro de conexão:', error.message);
	});

	return socket;
};

export const disconnectSocket = () => {
	if (socket) {
		socket.disconnect();
		socket = null;
	}
};

export const getSocket = () => socket;
