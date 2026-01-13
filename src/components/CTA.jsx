import React from 'react'
import { PhoneCall, Mail, Clock, ArrowRight, Star } from 'lucide-react'

export default function CTA() {
	return (
		<section className="max-w-7xl mx-auto px-4">
			<div className="">
				<div className="relative rounded-3xl overflow-hidden bg-[#1a1a2e] shadow-2xl isolate">
					{/* Background Decorations */}
					<div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-[#e65100] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse"></div>
					<div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-blue-600 rounded-full mix-blend-multiply filter blur-[80px] opacity-20"></div>

					<div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 md:p-12 lg:p-16 items-center">
						{/* Left: Content */}
						<div className="space-y-8">
							<div>
								<h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
									Encontre o carro <br />
									<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffcd82] to-[#e65100]">
										dos seus sonhos.
									</span>
								</h2>
								<p className="mt-6 text-lg text-gray-300 max-w-xl leading-relaxed">
									Não vendemos apenas carros, entregamos liberdade. Navegue por centenas de ofertas verificadas ou fale com nossos especialistas para encontrar a solução perfeita para si.
								</p>
							</div>

							<div className="flex flex-col sm:flex-row gap-4">
								<a href="/ofertas" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#e65100] text-white font-bold text-lg hover:bg-[#ff6d00] transition-all hover:scale-105 shadow-lg shadow-orange-900/20">
									Ver Ofertas
									<ArrowRight size={20} />
								</a>
								<a href="/contato" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/5 text-white font-semibold hover:bg-white/10 border border-white/10 backdrop-blur-sm transition-all">
									Falar com Especialista
								</a>
							</div>
						</div>

						{/* Right: Abstract/Dynamic element */}
						<div className="relative hidden lg:block h-full min-h-[300px]">
							<div className="absolute inset-0 flex items-center justify-center">
								{/* Stylized Abstract Car Shape using gradients/css shapes or just a nice composition */}
								<div className="relative w-full aspect-video rounded-2xl bg-gradient-to-tr from-gray-800 to-gray-900 border border-white/10 p-6 flex flex-col justify-between overflow-hidden group hover:border-[#e65100]/50 transition-colors duration-500">
									<div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:scale-110 transition-transform duration-700"></div>
									<div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] to-transparent"></div>

									<div className="relative z-10 flex justify-between items-start">
										<div className=" text-white text-xs font-bold px-3 py-1 rounded"></div>
									</div>

									<div className="relative z-10">
										<h3 className="text-2xl font-bold text-white mb-1">Qualidade Garantida</h3>
										<p className="text-gray-300 text-sm">Todos os nossos veículos passam por uma inspeção rigorosa de 150 pontos.</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Bottom Bar */}
					<div className="border-t border-white/5 bg-black/20 backdrop-blur-md">
						<div className="max-w-7xl mx-auto px-8 py-8">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
								<div className="flex items-center gap-4 group cursor-pointer">
									<div className="w-12 h-12 rounded-xl bg-gray-800/50 flex items-center justify-center group-hover:bg-[#e65100] transition-colors duration-300">
										<PhoneCall className="w-5 h-5 text-gray-300 group-hover:text-white" />
									</div>
									<div>
										<div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Ligue para nós</div>
										<div className="text-white font-bold group-hover:text-[#e65100] transition-colors">+244 912 345 678</div>
									</div>
								</div>

								<div className="flex items-center gap-4 group cursor-pointer">
									<div className="w-12 h-12 rounded-xl bg-gray-800/50 flex items-center justify-center group-hover:bg-[#e65100] transition-colors duration-300">
										<Mail className="w-5 h-5 text-gray-300 group-hover:text-white" />
									</div>
									<div>
										<div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Envie um email</div>
										<div className="text-white font-bold group-hover:text-[#e65100] transition-colors">info@caxiauto.com</div>
									</div>
								</div>

								<div className="flex items-center gap-4 group cursor-pointer">
									<div className="w-12 h-12 rounded-xl bg-gray-800/50 flex items-center justify-center group-hover:bg-[#e65100] transition-colors duration-300">
										<Clock className="w-5 h-5 text-gray-300 group-hover:text-white" />
									</div>
									<div>
										<div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Horário</div>
										<div className="text-white font-bold group-hover:text-[#e65100] transition-colors">Seg - Dom: 8:00 - 20:00</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

