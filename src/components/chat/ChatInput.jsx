import React, { useState, useRef, useCallback } from 'react';
import { Send } from 'lucide-react';
import useChatStore from '../../stores/chatStore';
import { notyf } from '../../services/api';

export default function ChatInput({ conversationId }) {
	const [text, setText] = useState('');
	const inputRef = useRef(null);
	const { sendMessage, emitTyping, emitStopTyping } = useChatStore();
	const typingTimeoutRef = useRef(null);

	const handleTyping = useCallback(() => {
		emitTyping(conversationId);
		if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
		typingTimeoutRef.current = setTimeout(() => {
			emitStopTyping(conversationId);
		}, 1500);
	}, [conversationId, emitTyping, emitStopTyping]);

	const handleSend = async () => {
		const trimmed = text.trim();
		if (!trimmed) return;

		setText('');
		if (typingTimeoutRef.current) {
			clearTimeout(typingTimeoutRef.current);
			emitStopTyping(conversationId);
		}

		const res = await sendMessage(conversationId, trimmed);
		// Rollback: se a mensagem não foi enviada (sem conexão / erro), repõe o texto
		// para o utilizador não perder a mensagem.
		if (!res?.success) {
			setText((prev) => (prev ? `${prev} ${trimmed}` : trimmed));
			notyf.error(res?.message || 'Falha ao enviar mensagem. Tente novamente.');
		}
		inputRef.current?.focus();
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	return (
		<div className="border-t border-[#e5e7eb] p-4 bg-white">
			<div className="flex items-center gap-2">
				<input
					ref={inputRef}
					type="text"
					value={text}
					onChange={(e) => {
						setText(e.target.value);
						handleTyping();
					}}
					onKeyDown={handleKeyDown}
					placeholder="Digite sua mensagem..."
					className="flex-1 px-4 py-2.5 border border-[#e5e7eb] rounded-2xl outline-none transition-all font-body text-sm text-[#111827] placeholder:text-[#9ca3af] focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a]"
				/>
				<button
					onClick={handleSend}
					disabled={!text.trim()}
					className="w-10 h-10 bg-[#154c9a] hover:bg-[#123f80] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer"
					aria-label="Enviar mensagem"
				>
					<Send className="w-4 h-4" />
				</button>
			</div>
		</div>
	);
}
