import React from 'react'
import { MapPin, PhoneCall, Mail, Facebook, Instagram } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
	return (
		<footer className="bg-gray-900 text-gray-100">
			<div className="max-w-7xl mx-auto pt-12 pb-6 px-6">

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{/* Left: logo + desc + social */}
					<div>
						<div className="flex items-center gap-3">
							<Link to="/" aria-label="Caxiauto Home">
								<img src="/images/logos/LogoBrancoCroopedBG-removebg-preview.png" alt="Caxiauto" className="h-8" />
							</Link>
						</div>
						<p className="mt-3 text-gray-300 text-sm">Compra, venda e serviços automóveis. Soluções fáceis e seguras para encontrar o seu próximo carro.</p>

						<div className="mt-6 flex items-center gap-3">
							<a href="https://www.facebook.com/TeamBuil.ea/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 bg-white/5 text-gray-200 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
								<Facebook className="w-4 h-4" />
							</a>
							<a href="https://www.instagram.com/caxiauto.ao/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 bg-white/5 text-gray-200 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
								<Instagram className="w-4 h-4" />
							</a>
						</div>
					</div>

					{/* Serviços */}
					<div>
						<h5 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Serviços</h5>
						<ul className="mt-4 space-y-2 text-sm">
							<li><Link to="/servicos/gps" className="text-gray-300 hover:text-white transition-colors">GPS</Link></li>
							<li><Link to="/servicos/reboque" className="text-gray-300 hover:text-white transition-colors">Reboque</Link></li>
							<li><Link to="/servicos/seguro-automovel" className="text-gray-300 hover:text-white transition-colors">Seguro Automóvel</Link></li>
							<li><Link to="/servicos/aluguel-de-automoveis" className="text-gray-300 hover:text-white transition-colors">Aluguel de Automóveis</Link></li>
						</ul>
					</div>

					{/* Empresa */}
					<div>
						<h5 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Empresa</h5>
						<ul className="mt-4 space-y-2 text-sm">
							<li><Link to="/contato" className="text-gray-300 hover:text-white transition-colors">Contato</Link></li>
							<li><Link to="/parceiros" className="text-gray-300 hover:text-white transition-colors">Parceiros</Link></li>
							<li><Link to="/sobre" className="text-gray-300 hover:text-white transition-colors">Sobre nós</Link></li>
							<li><Link to="/como-funciona" className="text-gray-300 hover:text-white transition-colors">Como funciona</Link></li>
							<li><Link to="/politica-de-privacidade" className="text-gray-300 hover:text-white transition-colors">Política de Privacidade</Link></li>
							<li><Link to="/termos-de-uso" className="text-gray-300 hover:text-white transition-colors">Termos de Uso</Link></li>
						</ul>
					</div>

					{/* Right: contact column */}
					<div>
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
									<a href="tel:+244930723503" className="text-sm hover:text-white">+244 930 723 503</a>
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

				<div className="mt-8 pt-6 border-t border-gray-800 items-center justify-center gap-6">
					<div className="text-sm text-gray-400 text-center">© {new Date().getFullYear()} Caxiauto. Todos os direitos reservados <br />Desenvolvido por <a href="#">Caxinda Divulga</a></div>
				</div>
			</div>
		</footer>
	)
}
