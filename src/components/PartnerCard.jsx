import React from 'react'
import { Phone, MessageCircle } from 'lucide-react'
import { getImageUrl } from '../services/api'

export default function PartnerCard({ partner }) {
	return (
		<div className="group bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden transition-all duration-300 hover:border-[#154c9a]/20 flex flex-col">
			<div className="relative aspect-video bg-[#eef3fa] overflow-hidden">
				{partner.banner && (
					<img
						src={getImageUrl(partner.banner, null)}
						alt=""
						className="w-full h-full object-cover"
						onError={(e) => { e.target.style.display = 'none' }}
					/>
				)}
			</div>

			<div className="relative -mt-12 flex justify-center z-10 mb-4">
				<div className="w-24 h-24 rounded-full bg-white p-1.5 shadow-sm ring-1 ring-gray-900/5">
					<img
						src={getImageUrl(partner.logo, 'https://placehold.co/100x100/f3f4f6/1e293b?text=' + encodeURIComponent(partner.name.substring(0, 2)))}
						alt={partner.name}
						className="w-full h-full object-contain rounded-full"
						onError={(e) => {
							e.target.src = 'https://placehold.co/100x100/f3f4f6/1e293b?text=' + encodeURIComponent(partner.name.substring(0, 2))
						}}
					/>
				</div>
			</div>

			<div className="px-5 pb-5 flex-grow flex flex-col">
				<h3 className="font-display text-xl font-bold text-[#111827] mb-3 text-center">
					{partner.name}
				</h3>

				{partner.characteristics?.length > 0 && (
					<ul className="space-y-1.5 mb-6 flex-grow">
						{partner.characteristics.map((c, i) => (
							<li key={i} className="flex items-start gap-2 font-body text-sm text-[#6b7280]">
								<span className="text-[#154c9a] mt-0.5 flex-shrink-0">•</span>
								{c}
							</li>
						))}
					</ul>
				)}

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
					<a
						href={`https://wa.me/${partner.whatsapp.replace(/\s/g, '')}`}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center justify-center gap-2 bg-[#154c9a] hover:bg-[#0c2d5e] text-white py-3 px-4 rounded-2xl text-sm font-semibold font-body transition-all duration-300"
					>
						<MessageCircle size={16} />
						WhatsApp
					</a>
					<a
						href={`tel:${partner.phone}`}
						className="inline-flex items-center justify-center gap-2 bg-[#d41120] hover:bg-[#b80f1c] text-white py-3 px-4 rounded-2xl text-sm font-semibold font-body transition-all duration-300"
					>
						<Phone size={16} />
						Ligar
					</a>
				</div>
			</div>
		</div>
	)
}
