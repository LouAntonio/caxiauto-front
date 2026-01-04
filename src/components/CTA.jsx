import React from 'react'
import { PhoneCall, Mail, Clock } from 'lucide-react'

export default function CTA() {
	return (
		<section className="py-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="rounded-2xl shadow-lg overflow-hidden">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-white p-8 md:p-12">
						<div>
							<h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">O seu próximo carro está à sua espera aqui...</h2>
							<p className="mt-4 text-gray-600 max-w-xl">Navegue pelas melhores ofertas, fale com um especialista ou solicite uma avaliação — ajudamos em todo o processo.</p>

							<div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
								<a href="/ofertas" style={{ backgroundColor: 'var(--primary)' }} className="inline-flex items-center gap-3 text-white px-5 py-3 rounded-full shadow-2xl transform hover:-translate-y-0.5 transition">
									<span className="font-semibold">962 741</span>
									<span className="text-sm opacity-90">Offers</span>
								</a>

								<div className="flex gap-3">
									<a href="/contato" style={{ backgroundColor: 'var(--secondary)' }} className="inline-flex items-center justify-center px-4 py-2 rounded-md text-white font-semibold shadow-sm hover:opacity-90">
										Fale Connosco
									</a>
									<a href="/servicos" className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-gray-200 text-sm font-medium hover:bg-gray-50">
										Ver Serviços
									</a>
								</div>
							</div>
						</div>

						<div className="flex justify-center md:justify-end">
							<div className="w-56 h-56 bg-gradient-to-br from-indigo-50 to-white rounded-lg flex items-center justify-center">
								<svg width="160" height="120" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
									<rect x="6" y="46" width="148" height="48" rx="8" fill="#EEF2FF" />
									<path d="M18 46c8-14 34-30 70-30s62 16 70 30" stroke="#C7D2FE" strokeWidth="2" strokeLinecap="round" />
									<circle cx="48" cy="98" r="8" fill="#A5B4FC" />
									<circle cx="112" cy="98" r="8" fill="#A5B4FC" />
								</svg>
							</div>
						</div>
					</div>

					<div className="bg-gray-50 border-t px-6 py-6">
						<div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
							<div className="flex items-center gap-4">
								<div className="w-12 h-12 rounded-full bg-white shadow flex items-center justify-center">
									<PhoneCall className="w-5 h-5 text-indigo-600" />
								</div>
								<div>
									<div className="text-sm text-gray-500">Call us</div>
									<div className="font-semibold">+244 912 345 678</div>
									<div className="text-xs text-gray-400">Mo–Su 8 am–8 pm</div>
								</div>
							</div>

							<div className="flex items-center gap-4">
								<div className="w-12 h-12 rounded-full bg-white shadow flex items-center justify-center">
									<Mail className="w-5 h-5 text-indigo-600" />
								</div>
								<div>
									<div className="text-sm text-gray-500">Email</div>
									<a href="mailto:info@caxiauto.com" className="font-semibold text-indigo-600 hover:underline">info@caxiauto.com</a>
								</div>
							</div>

							<div className="flex items-center gap-4">
								<div className="w-12 h-12 rounded-full bg-white shadow flex items-center justify-center">
									<Clock className="w-5 h-5 text-indigo-600" />
								</div>
								<div>
									<div className="text-sm text-gray-500">Working hours</div>
									<div className="font-semibold">Mon–Sun 8:00–20:00</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

