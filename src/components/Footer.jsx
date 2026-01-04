import React from 'react'
import { MapPin, PhoneCall, Mail, Facebook, Instagram } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
	return (
		<footer className="bg-gray-900 text-gray-100 mt-12">
			<div className="max-w-7xl mx-auto pt-12 pb-6 px-6">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
					{/* Left: logo + desc + social */}
					<div className="lg:col-span-3">
						<div className="flex items-center gap-3">
							<Link to="/" aria-label="Caxiauto Home">
								<img src="/images/logos/LogoBrancoCroopedBG-removebg-preview.png" alt="Caxiauto" className="h-8" />
							</Link>
						</div>
						<p className="mt-3 text-gray-300 max-w-sm">Compra, venda e serviços automóveis. Soluções fáceis e seguras para encontrar o seu próximo carro.</p>

						<div className="mt-6 flex items-center gap-3">
							<a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 bg-white/5 text-gray-200 rounded-full flex items-center justify-center hover:bg-white/10">
								<Facebook className="w-4 h-4" />
							</a>
							<a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 bg-white/5 text-gray-200 rounded-full flex items-center justify-center hover:bg-white/10">
								<Instagram className="w-4 h-4" />
							</a>
						</div>
					</div>

					{/* Center: columns of links */}
					<div className="lg:col-span-6">
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
							<div>
								<h5 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Caxiauto</h5>
								<ul className="mt-4 space-y-2 text-sm">
									<li><Link to="/servicos/venda-de-automoveis" className="text-gray-300 hover:text-white">Comprar</Link></li>
									<li><Link to="/como-funciona" className="text-gray-300 hover:text-white">Como funciona</Link></li>
									<li><Link to="/sobre" className="text-gray-300 hover:text-white">Sobre nós</Link></li>
									<li><Link to="/servicos/venda-de-automoveis" className="text-gray-300 hover:text-white">Elétricos & Híbridos</Link></li>
									<li><Link to="/" className="text-gray-300 hover:text-white">Mapa do site</Link></li>
								</ul>
							</div>

							<div>
								<h5 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Serviços</h5>
								<ul className="mt-4 space-y-2 text-sm">
									<li><Link to="/servicos/reboque" className="text-gray-300 hover:text-white">Reboque</Link></li>
									<li><Link to="/servicos/venda-de-pecas" className="text-gray-300 hover:text-white">Venda de Peças</Link></li>
									<li><Link to="/servicos/aluguel-de-automoveis" className="text-gray-300 hover:text-white">Aluguel de automóveis</Link></li>
									<li><Link to="/servicos/venda-seu-automovel" className="text-gray-300 hover:text-white">Venda o seu automóvel</Link></li>
								</ul>
							</div>

							<div>
								<h5 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Empresa</h5>
								<ul className="mt-4 space-y-2 text-sm">
									<li><Link to="/contato" className="text-gray-300 hover:text-white">Contato</Link></li>
									<li><Link to="/sobre" className="text-gray-300 hover:text-white">Sobre nós</Link></li>
									<li><Link to="/termos" className="text-gray-300 hover:text-white">Termos de uso</Link></li>
									<li><Link to="/politica" className="text-gray-300 hover:text-white">Política de privacidade</Link></li>
								</ul>
							</div>

							{/* Recursos column removed as requested */}
						</div>
					</div>

					{/* Right: contact column (kept for quick access) */}
					<div className="lg:col-span-3">
						<h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Contato</h4>
						<div className="mt-4 space-y-3 text-gray-300">
							<div className="flex items-start gap-3">
								<div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center">
									<MapPin className="w-4 h-4 text-indigo-400" />
								</div>
								<div>
									<div className="text-sm">Luanda, Angola</div>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center">
									<PhoneCall className="w-4 h-4 text-indigo-400" />
								</div>
								<div>
									<a href="tel:+244912345678" className="text-sm hover:text-white">+244 912 345 678</a>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center">
									<Mail className="w-4 h-4 text-indigo-400" />
								</div>
								<div>
									<a href="mailto:info@caxiauto.com" className="text-sm hover:text-white">info@caxiauto.com</a>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-8 pt-6 border-t border-gray-800 flex flex-col lg:flex-row items-center justify-between gap-6">
					<div className="text-sm text-gray-400">© {new Date().getFullYear()} Caxiauto. Todos os direitos reservados</div>

						<div className="flex items-center gap-3">
							<Link to="/" aria-label="Caxiauto Home">
								<img src="/images/logos/caxiauto-logo.svg" alt="Caxiauto" className="h-8" />
							</Link>
							<img src="/images/logos/discover.png" alt="discover" className="h-6" />
						</div>
					</div>
				</div>
		</footer>
	)
}
