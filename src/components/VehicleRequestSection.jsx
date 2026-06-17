import React, { useState } from 'react'
import { Search, X, Mail, Phone, Car, Calendar, DollarSign, MapPin } from 'lucide-react'

export default function VehicleRequestSection() {
	const [showModal, setShowModal] = useState(false)

	const handleSubmit = (e) => {
		e.preventDefault()
		alert('Solicitação enviada com sucesso! Entraremos em contato em breve.')
		setShowModal(false)
	}

	return (
		<>
			<section className="my-8">
				<div className="bg-[#154c9a] rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
					<div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
					<div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

					<div className="relative z-10 max-w-3xl mx-auto text-center">
						<div className="inline-flex items-center justify-center w-16 h-16 bg-[#d41120] rounded-2xl mb-6">
							<Search className="w-8 h-8" />
						</div>

						<h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
							Não encontrou o veículo que procura?
						</h2>

						<p className="font-body text-lg text-blue-100/80 mb-8">
							Conte-nos o que está à procura e nós encontramos para si!
							Preencha o formulário com os detalhes do veículo desejado.
						</p>

						<button
							onClick={() => setShowModal(true)}
							className="bg-white text-[#154c9a] font-semibold px-8 py-4 rounded-2xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-body cursor-pointer"
						>
							Solicitar Veículo
						</button>
					</div>
				</div>
			</section>

			{showModal && (
				<div
					className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50"
					onClick={(e) => {
						if (e.target === e.currentTarget) {
							setShowModal(false)
						}
					}}
				>
					<div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto relative">
						<div className="sticky top-0 bg-[#154c9a] px-4 sm:px-6 pt-5 sm:pt-6 pb-4 sm:pb-5 rounded-t-2xl z-10 shadow-lg">
							<button
								onClick={() => setShowModal(false)}
								className="absolute top-3 sm:top-4 right-3 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all hover:rotate-90 cursor-pointer"
								aria-label="Fechar"
							>
								<X className="w-5 h-5 text-white" />
							</button>

							<div className="pr-10">
								<h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-1.5 sm:mb-2">
									Solicitar Veículo
								</h3>
								<p className="font-body text-blue-100 text-xs sm:text-sm">
									Preencha os dados do veículo que procura
								</p>
							</div>
						</div>

						<form
							className="p-4 sm:p-6 space-y-4 sm:space-y-5"
							onSubmit={handleSubmit}
						>
							<div className="space-y-4">
								<h4 className="font-display text-base sm:text-lg font-bold text-[#111827] flex items-center gap-2 pb-2 border-b-2 border-[#d41120]">
									<Mail className="w-5 h-5 text-[#154c9a]" />
									Seus Dados
								</h4>

								<div>
									<label className="flex items-center font-body text-xs sm:text-sm font-medium text-[#6b7280] mb-2">
										<span className="flex items-center gap-1.5">
											Nome completo
											<span className="text-[#d41120] text-base">*</span>
										</span>
									</label>
									<input
										type="text"
										required
										className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-[#e5e7eb] rounded-2xl outline-none transition-all font-body text-[#111827] placeholder:text-[#9ca3af] focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a] text-sm sm:text-base"
										placeholder="Digite seu nome completo"
									/>
								</div>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label className="flex items-center font-body text-xs sm:text-sm font-medium text-[#6b7280] mb-2">
											<span className="flex items-center gap-1.5">
												Telefone
												<span className="text-[#d41120] text-base">*</span>
											</span>
										</label>
										<input
											type="tel"
											required
											className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-[#e5e7eb] rounded-2xl outline-none transition-all font-body text-[#111827] placeholder:text-[#9ca3af] focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a] text-sm sm:text-base"
											placeholder="+244 9XX XXX XXX"
										/>
									</div>

									<div>
										<label className="flex items-center font-body text-xs sm:text-sm font-medium text-[#6b7280] mb-2">
											<span className="flex items-center gap-1.5">
												E-mail
												<span className="text-[#d41120] text-base">*</span>
											</span>
										</label>
										<input
											type="email"
											required
											className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-[#e5e7eb] rounded-2xl outline-none transition-all font-body text-[#111827] placeholder:text-[#9ca3af] focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a] text-sm sm:text-base"
											placeholder="seu@email.com"
										/>
									</div>
								</div>
							</div>

							<div className="pt-4 border-t border-[#e5e7eb] space-y-4">
								<h4 className="font-display text-base sm:text-lg font-bold text-[#111827] flex items-center gap-2 pb-2 border-b-2 border-[#d41120]">
									<Car className="w-5 h-5 text-[#154c9a]" />
									Detalhes do Veículo Desejado
								</h4>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label className="flex items-center font-body text-xs sm:text-sm font-medium text-[#6b7280] mb-2">
											<span className="flex items-center gap-1.5">
												Marca
												<span className="text-[#d41120] text-base">*</span>
											</span>
										</label>
										<input
											type="text"
											required
											className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-[#e5e7eb] rounded-2xl outline-none transition-all font-body text-[#111827] placeholder:text-[#9ca3af] focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a] text-sm sm:text-base"
											placeholder="Ex: Toyota, Honda..."
										/>
									</div>

									<div>
										<label className="flex items-center font-body text-xs sm:text-sm font-medium text-[#6b7280] mb-2">
											<span className="flex items-center gap-1.5">
												Modelo
												<span className="text-[#d41120] text-base">*</span>
											</span>
										</label>
										<input
											type="text"
											required
											className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-[#e5e7eb] rounded-2xl outline-none transition-all font-body text-[#111827] placeholder:text-[#9ca3af] focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a] text-sm sm:text-base"
											placeholder="Ex: Corolla, Civic..."
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label className="flex items-center font-body text-xs sm:text-sm font-medium text-[#6b7280] mb-2">
											<span className="flex items-center gap-1.5">
												<Calendar className="w-4 h-4" />
												Ano (de - até)
											</span>
										</label>
										<div className="flex gap-2 items-center">
											<input
												type="number"
												min="1990"
												max="2026"
												className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-[#e5e7eb] rounded-2xl outline-none transition-all font-body text-[#111827] placeholder:text-[#9ca3af] focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a] text-sm sm:text-base"
												placeholder="2020"
											/>
											<span className="text-[#6b7280] font-body">-</span>
											<input
												type="number"
												min="1990"
												max="2026"
												className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-[#e5e7eb] rounded-2xl outline-none transition-all font-body text-[#111827] placeholder:text-[#9ca3af] focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a] text-sm sm:text-base"
												placeholder="2024"
											/>
										</div>
									</div>

									<div>
										<label className="flex items-center font-body text-xs sm:text-sm font-medium text-[#6b7280] mb-2">
											<span className="flex items-center gap-1.5">
												<DollarSign className="w-4 h-4" />
												Orçamento (Kz)
											</span>
										</label>
										<input
											type="text"
											className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-[#e5e7eb] rounded-2xl outline-none transition-all font-body text-[#111827] placeholder:text-[#9ca3af] focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a] text-sm sm:text-base"
											placeholder="Ex: 5.000.000"
										/>
									</div>
								</div>

								<div>
									<label className="flex items-center font-body text-xs sm:text-sm font-medium text-[#6b7280] mb-2">
										<span className="flex items-center gap-1.5">
											<MapPin className="w-4 h-4" />
											Província preferida
										</span>
									</label>
									<select className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-[#e5e7eb] rounded-2xl outline-none transition-all font-body text-[#111827] bg-white focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a] text-sm sm:text-base cursor-pointer">
										<option value="">Selecione uma província</option>
										<option value="luanda">Luanda</option>
										<option value="benguela">Benguela</option>
										<option value="huambo">Huambo</option>
										<option value="huila">Huíla</option>
										<option value="cbinda">Cabinda</option>
										<option value="outras">Outras</option>
									</select>
								</div>

								<div>
									<label className="flex items-center font-body text-xs sm:text-sm font-medium text-[#6b7280] mb-2">
										Observações ou características específicas
									</label>
									<textarea
										rows="3"
										className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-[#e5e7eb] rounded-2xl outline-none transition-all font-body text-[#111827] placeholder:text-[#9ca3af] focus:border-[#154c9a] focus:ring-1 focus:ring-[#154c9a] resize-none text-sm sm:text-base"
										placeholder="Ex: Prefiro cor preta, com ar condicionado, câmbio automático..."
									/>
								</div>
							</div>

							<div className="pt-4 sm:pt-5 border-t border-[#e5e7eb] space-y-2.5 sm:space-y-3">
								<button
									type="submit"
									className="w-full bg-[#154c9a] hover:bg-blue-800 text-white font-semibold py-3 sm:py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl font-body flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
								>
									<Mail className="w-4 h-4 sm:w-5 sm:h-5" />
									Enviar Solicitação
								</button>
								<button
									type="button"
									onClick={() => setShowModal(false)}
									className="w-full bg-[#f8f6f2] hover:bg-[#eef3fa] text-[#6b7280] font-semibold py-2.5 sm:py-3 rounded-2xl transition-all font-body text-sm sm:text-base cursor-pointer"
								>
									Cancelar
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</>
	)
}
