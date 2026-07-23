import React from 'react';
import { Check, CheckCheck } from 'lucide-react';

function formatTime(dateStr) {
	if (!dateStr) return '';
	const date = new Date(dateStr);
	const now = new Date();
	const diff = now - date;
	const mins = Math.floor(diff / 60000);
	const hours = Math.floor(diff / 3600000);

	if (mins < 1) return 'agora';
	if (mins < 60) return `há ${mins}min`;
	if (hours < 24) return `há ${hours}h`;

	return date.toLocaleDateString('pt-PT', {
		day: '2-digit',
		month: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
	});
}

export default function ChatMessage({ message, isOwn }) {
	return (
		<div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
			<div
				className={`max-w-[80%] px-4 py-2.5 ${
					isOwn
						? 'bg-white border-l-4 border-[#154c9a] ml-2 rounded-r-2xl rounded-tl-2xl'
						: 'bg-[#f5f5f5] mr-2 rounded-l-2xl rounded-tr-2xl'
				}`}
			>
				<p className="font-body text-sm text-[#1a1a1a] whitespace-pre-wrap break-words">
					{message.text}
				</p>
				<div className="flex items-center justify-end gap-1 mt-1">
					<span className="font-body text-[10px] text-[#9ca3af]">
						{formatTime(message.createdAt)}
					</span>
					{isOwn && (
						message.readAt ? (
							<CheckCheck className="w-3.5 h-3.5 text-[#154c9a]" />
						) : (
							<Check className="w-3.5 h-3.5 text-[#9ca3af]" />
						)
					)}
				</div>
			</div>
		</div>
	);
}
