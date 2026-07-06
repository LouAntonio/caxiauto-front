import React from 'react'
import { MapPin, PhoneCall, Mail, Facebook, Instagram, Linkedin, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
	return (
		<footer className="bg-gray-900 text-gray-100">
			<div className="max-w-7xl mx-auto pt-12 pb-6 px-6 lg:px-8">

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{/* Left: logo + desc + social */}
					<div>
						<div className="flex items-center gap-3">
							<Link to="/" aria-label="Caxiauto Home">
								<img src="/images/logos/LogoBrancoCroopedBG-removebg-preview.png" alt="Caxiauto" className="h-8" />
							</Link>
						</div>
						<p className="mt-3 text-gray-300 text-sm font-body">Compra, venda e serviços automóveis. Soluções fáceis e seguras para encontrar o seu próximo carro.</p>

						<div className="mt-6 flex items-center gap-3">
							<a href="https://www.facebook.com/TeamBuil.ea/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 bg-white/5 text-gray-200 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
								<Facebook className="w-4 h-4 text-[#d41120]" />
							</a>
							<a href="https://www.instagram.com/caxiauto.ao/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 bg-white/5 text-gray-200 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
								<Instagram className="w-4 h-4 text-[#d41120]" />
							</a>
							<a href="https://www.tiktok.com/@caxiauto5?_r=1&_t=ZS-97KGKjNnijt" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="w-9 h-9 bg-white/5 text-gray-200 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
								<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#d41120]">
									<path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
								</svg>
							</a>
							<a href="https://www.linkedin.com/groups/25430014" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-9 h-9 bg-white/5 text-gray-200 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
								<Linkedin className="w-4 h-4 text-[#d41120]" />
							</a>
						</div>
					</div>

					{/* Serviços */}
					<div>
						<h5 className="text-sm font-semibold text-gray-400 uppercase tracking-wider font-display">Serviços</h5>
						<ul className="mt-4 space-y-2 text-sm">
							<li className="flex items-center gap-2 group"><ChevronRight size={12} className="text-gray-300 group-hover:text-[#d41120] flex-shrink-0 transition-colors" /><Link to="/servicos/gps" className="text-gray-300 group-hover:text-[#d41120] transition-colors font-body">GPS</Link></li>
							<li className="flex items-center gap-2 group"><ChevronRight size={12} className="text-gray-300 group-hover:text-[#d41120] flex-shrink-0 transition-colors" /><Link to="/servicos/reboque" className="text-gray-300 group-hover:text-[#d41120] transition-colors font-body">Reboque</Link></li>
							<li className="flex items-center gap-2 group"><ChevronRight size={12} className="text-gray-300 group-hover:text-[#d41120] flex-shrink-0 transition-colors" /><Link to="/servicos/seguro-automovel" className="text-gray-300 group-hover:text-[#d41120] transition-colors font-body">Seguro Automóvel</Link></li>
							<li className="flex items-center gap-2 group"><ChevronRight size={12} className="text-gray-300 group-hover:text-[#d41120] flex-shrink-0 transition-colors" /><Link to="/servicos/aluguel-de-automoveis" className="text-gray-300 group-hover:text-[#d41120] transition-colors font-body">Aluguel de Automóveis</Link></li>
						</ul>
					</div>

					{/* Empresa */}
					<div>
						<h5 className="text-sm font-semibold text-gray-400 uppercase tracking-wider font-display">Empresa</h5>
						<ul className="mt-4 space-y-2 text-sm">
							<li className="flex items-center gap-2 group"><ChevronRight size={12} className="text-gray-300 group-hover:text-[#d41120] flex-shrink-0 transition-colors" /><Link to="/contato" className="text-gray-300 group-hover:text-[#d41120] transition-colors font-body">Contato</Link></li>
							<li className="flex items-center gap-2 group"><ChevronRight size={12} className="text-gray-300 group-hover:text-[#d41120] flex-shrink-0 transition-colors" /><Link to="/parceiros" className="text-gray-300 group-hover:text-[#d41120] transition-colors font-body">Parceiros</Link></li>
							<li className="flex items-center gap-2 group"><ChevronRight size={12} className="text-gray-300 group-hover:text-[#d41120] flex-shrink-0 transition-colors" /><Link to="/sobre" className="text-gray-300 group-hover:text-[#d41120] transition-colors font-body">Sobre nós</Link></li>
							<li className="flex items-center gap-2 group"><ChevronRight size={12} className="text-gray-300 group-hover:text-[#d41120] flex-shrink-0 transition-colors" /><Link to="/como-funciona" className="text-gray-300 group-hover:text-[#d41120] transition-colors font-body">Como funciona</Link></li>
							<li className="flex items-center gap-2 group"><ChevronRight size={12} className="text-gray-300 group-hover:text-[#d41120] flex-shrink-0 transition-colors" /><Link to="/politica-de-privacidade" className="text-gray-300 group-hover:text-[#d41120] transition-colors font-body">Política de Privacidade</Link></li>
							<li className="flex items-center gap-2 group"><ChevronRight size={12} className="text-gray-300 group-hover:text-[#d41120] flex-shrink-0 transition-colors" /><Link to="/termos-de-uso" className="text-gray-300 group-hover:text-[#d41120] transition-colors font-body">Termos de Uso</Link></li>
						</ul>
					</div>

					{/* Right: contact column */}
					<div>
						<h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider font-display">Contato</h4>
						<div className="mt-4 space-y-3 text-gray-300">
							<div className="flex items-start gap-3">
								<div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center">
									<MapPin className="w-4 h-4 text-[#d41120]" />
								</div>
								<div>
									<div className="text-sm font-body">Luanda, Angola</div>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center">
									<PhoneCall className="w-4 h-4 text-[#d41120]" />
								</div>
								<div>
									<a href="tel:+244930723503" className="text-sm hover:text-white font-body">+244 930 723 503</a>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center">
									<Mail className="w-4 h-4 text-[#d41120]" />
								</div>
								<div>
									<a href="mailto:info@caxiauto.com" className="text-sm hover:text-white font-body">info@caxiauto.com</a>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-8 pt-6 border-t border-gray-800 items-center justify-center gap-6">
					<div className="text-sm text-gray-400 text-center font-body">© {new Date().getFullYear()} Caxiauto. Todos os direitos reservados <br />Desenvolvido por <a href="https://mediaguideagency.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Media Guide Agency</a></div>
				</div>
			</div>
		</footer>
	)
}
