import React from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import {
	Phone,
	Mail,
	MapPin,
	Clock,
	Send,
	MessageSquare,
	Facebook,
	Instagram,
	Linkedin
} from 'lucide-react';

export default function Contato() {
	useDocumentTitle('Contactos - Caxiauto');

	const contactMethods = [
		{
			icon: Phone,
			title: 'Ligue-nos',
			info: '+244 923 456 789',
			subInfo: 'Segunda a Sexta, 8h às 18h',
			action: 'tel:+244923456789',
			actionLabel: 'Ligar agora'
		},
		{
			icon: Mail,
			title: 'Envie um Email',
			info: 'geral@caxiauto.ao',
			subInfo: 'Respondemos em até 24 horas',
			action: 'mailto:geral@caxiauto.ao',
			actionLabel: 'Enviar email'
		},
		{
			icon: MapPin,
			title: 'Visite-nos',
			info: 'Rua Principal, Luanda',
			subInfo: 'Angola',
			action: '#map',
			actionLabel: 'Ver no mapa'
		}
	];

	return (
		<main className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
			{/* Hero Section */}
			<section className="py-24 px-6 bg-[#154c9a] text-white relative overflow-hidden isolate">
				<div
					className="absolute inset-0 -z-10 opacity-10"
					style={{
						backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
					}}
				></div>

				<div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-3xl"></div>
				<div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-3xl"></div>

				<div className="max-w-4xl mx-auto text-center relative z-10">
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-100 mb-6 backdrop-blur-sm">
						<MessageSquare className="w-5 h-5" />
						<span className="font-medium">Estamos aqui para ajudar</span>
					</div>
					<h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight">
						Fale Connosco
					</h1>
					<p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
						Tem dúvidas sobre os nossos serviços ou quer saber mais sobre uma viatura? Entre em contacto com a nossa equipa.
					</p>
				</div>
			</section>

			{/* Contact Methods Grid */}
			<section className="py-20 px-6 -mt-16 relative z-20">
				<div className="max-w-7xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{contactMethods.map((method, index) => (
							<div key={index} className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 flex flex-col items-center text-center hover:transform hover:-translate-y-2 transition-all duration-300 group">
								<div className="w-16 h-16 bg-blue-50 text-[#154c9a] rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-[#154c9a] group-hover:text-white transition-colors duration-300">
									<method.icon size={32} />
								</div>
								<h3 className="text-xl font-bold text-gray-900 mb-2">{method.title}</h3>
								<p className="text-lg font-semibold text-[#154c9a] mb-1">{method.info}</p>
								<p className="text-gray-500 text-sm mb-6">{method.subInfo}</p>
								<a
									href={method.action}
									className="mt-auto inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-full text-[#154c9a] bg-blue-50 hover:bg-blue-100 transition-colors"
								>
									{method.actionLabel}
								</a>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Contact Form Section */}
			<section className="py-20 px-6">
				<div className="max-w-7xl mx-auto">
					<div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
						<div className="grid grid-cols-1 lg:grid-cols-2">
							{/* Form Info Side */}
							<div className="bg-[#154c9a] p-12 text-white flex flex-col justify-between relative overflow-hidden">
								<div className="absolute inset-0 bg-blue-600/30 mix-blend-multiply"></div>
								<div className="absolute bottom-0 right-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
									<MessageSquare size={300} />
								</div>

								<div className="relative z-10">
									<h2 className="text-3xl font-bold mb-6">Envie uma Mensagem</h2>
									<p className="text-blue-100 text-lg mb-12">
										Preencha o formulário e a nossa equipa entrará em contacto consigo o mais breve possível.
									</p>

									<div className="space-y-8">
										<div className="flex items-center gap-4">
											<div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
												<Clock className="w-5 h-5" />
											</div>
											<div>
												<h4 className="font-semibold">Horário de Funcionamento</h4>
												<p className="text-blue-200 text-sm">Seg - Sex: 08:00 - 18:00</p>
												<p className="text-blue-200 text-sm">Sábado: 09:00 - 13:00</p>
											</div>
										</div>

										<div className="flex items-center gap-4">
											<div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
												<ShareSocialIcons />
											</div>
											<div>
												<h4 className="font-semibold">Redes Sociais</h4>
												<div className="flex gap-4 mt-2">
													<SocialLink icon={Facebook} href="#" />
													<SocialLink icon={Instagram} href="#" />
													<SocialLink icon={Linkedin} href="#" />
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Form Inputs Side */}
							<div className="p-12 lg:p-16 bg-white">
								<form className="space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
											<input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#154c9a] focus:ring-2 focus:ring-blue-100 outline-none transition-all cursor-pointer bg-gray-50 focus:bg-white" placeholder="Seu nome" />
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
											<input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#154c9a] focus:ring-2 focus:ring-blue-100 outline-none transition-all cursor-pointer bg-gray-50 focus:bg-white" placeholder="seu@email.com" />
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
											<input type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#154c9a] focus:ring-2 focus:ring-blue-100 outline-none transition-all cursor-pointer bg-gray-50 focus:bg-white" placeholder="+244 912 345 678." />
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Assunto</label>
											<select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#154c9a] focus:ring-2 focus:ring-blue-100 outline-none transition-all cursor-pointer bg-gray-50 focus:bg-white text-gray-600">
												<option value="">Selecione um assunto</option>
												<option value="vendas">Comprar Viatura</option>
												<option value="aluguel">Aluguer</option>
												<option value="pecas">Peças</option>
												<option value="financeiro">Financeiro</option>
												<option value="outro">Outro</option>
											</select>
										</div>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">Mensagem</label>
										<textarea rows="4" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#154c9a] focus:ring-2 focus:ring-blue-100 outline-none transition-all cursor-pointer bg-gray-50 focus:bg-white resize-none" placeholder="Como podemos ajudar?"></textarea>
									</div>

									<button type="submit" className="w-full py-4 bg-[#154c9a] text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:bg-blue-800 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
										<Send className="w-5 h-5" />
										Enviar Mensagem
									</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Map Section (Placeholder) */}
			<section className="h-[400px] bg-slate-100 relative">
				<div className="absolute inset-0 flex items-center justify-center text-gray-400">
					<div className="text-center">
						<MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
						<p className="font-medium">Mapa de Localização</p>
						<p className="text-sm">Rua Principal, Luanda, Angola</p>
					</div>
				</div>
				{/* You can embed a Google Map iframe here */}
			</section>
		</main>
	);
}

function ShareSocialIcons() {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
	)
}

function SocialLink({ icon: Icon, href }) {
	return (
		<a href={href} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white hover:text-[#154c9a] transition-all">
			<Icon size={16} />
		</a>
	)
}
