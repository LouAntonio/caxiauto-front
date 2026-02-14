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
			{/* Seção CTA */}
			<section className="my-8">
				<div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
					{/* Decorative elements */}
					<div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
					<div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

					<div className="relative z-10 max-w-3xl mx-auto text-center">
						<div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
							<Search className="w-8 h-8" />
						</div>

						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							Não encontrou o veículo que procura?
						</h2>

						<p className="text-lg text-indigo-100 mb-8">
							Conte-nos o que está à procura e nós encontramos para si! 
							Preencha o formulário com os detalhes do veículo desejado.
						</p>

						<button
							onClick={() => setShowModal(true)}
							className="bg-white text-indigo-600 font-bold px-8 py-4 rounded-xl hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
						>
							Solicitar Veículo
						</button>
					</div>
				</div>
			</section>

			{/* Modal */}
			{showModal && (
				<div
					className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50"
					onClick={(e) => {
						if (e.target === e.currentTarget) {
							setShowModal(false)
						}
					}}
				>
					<div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto relative animate-slideUp">
						{/* Header */}
						<div className="sticky top-0 bg-gradient-to-br from-indigo-600 to-indigo-700 px-4 sm:px-6 pt-5 sm:pt-6 pb-4 sm:pb-5 rounded-t-2xl sm:rounded-t-3xl z-10 shadow-lg">
							<button
								onClick={() => setShowModal(false)}
								className="absolute top-3 sm:top-4 right-3 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all hover:rotate-90 cursor-pointer"
								aria-label="Fechar"
							>
								<X className="w-5 h-5 text-white" />
							</button>

							<div className="pr-10">
								<h3 className="text-xl sm:text-2xl font-bold text-white mb-1.5 sm:mb-2">
									Solicitar Veículo
								</h3>
								<p className="text-indigo-100 text-xs sm:text-sm">
									Preencha os dados do veículo que procura
								</p>
							</div>
						</div>

						<form
							className="p-4 sm:p-6 space-y-4 sm:space-y-5"
							onSubmit={handleSubmit}
						>
							{/* Dados Pessoais */}
							<div className="space-y-4">
								<h4 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2 pb-2 border-b-2 border-indigo-200">
									<Mail className="w-5 h-5 text-indigo-600" />
									Seus Dados
								</h4>

								<div>
									<label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
										<span className="flex items-center gap-1.5">
											Nome completo
											<span className="text-red-500 text-base">*</span>
										</span>
									</label>
									<input
										type="text"
										required
										className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl outline-none transition-all hover:border-gray-400  text-sm sm:text-base"
										placeholder="Digite seu nome completo"
									/>
								</div>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
											<span className="flex items-center gap-1.5">
												Telefone
												<span className="text-red-500 text-base">*</span>
											</span>
										</label>
										<input
											type="tel"
											required
											className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl outline-none transition-all hover:border-gray-400  text-sm sm:text-base"
											placeholder="+244 9XX XXX XXX"
										/>
									</div>

									<div>
										<label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
											<span className="flex items-center gap-1.5">
												E-mail
												<span className="text-red-500 text-base">*</span>
											</span>
										</label>
										<input
											type="email"
											required
											className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl outline-none transition-all hover:border-gray-400  text-sm sm:text-base"
											placeholder="seu@email.com"
										/>
									</div>
								</div>
							</div>

							{/* Detalhes do Veículo */}
							<div className="pt-4 border-t border-gray-200 space-y-4">
								<h4 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2 pb-2 border-b-2 border-indigo-200">
									<Car className="w-5 h-5 text-indigo-600" />
									Detalhes do Veículo Desejado
								</h4>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
											<span className="flex items-center gap-1.5">
												Marca
												<span className="text-red-500 text-base">*</span>
											</span>
										</label>
										<input
											type="text"
											required
											className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl outline-none transition-all hover:border-gray-400  text-sm sm:text-base"
											placeholder="Ex: Toyota, Honda..."
										/>
									</div>

									<div>
										<label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
											<span className="flex items-center gap-1.5">
												Modelo
												<span className="text-red-500 text-base">*</span>
											</span>
										</label>
										<input
											type="text"
											required
											className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl outline-none transition-all hover:border-gray-400  text-sm sm:text-base"
											placeholder="Ex: Corolla, Civic..."
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
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
												className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl outline-none transition-all hover:border-gray-400  text-sm sm:text-base"
												placeholder="2020"
											/>
											<span className="text-gray-500">-</span>
											<input
												type="number"
												min="1990"
												max="2026"
												className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl outline-none transition-all hover:border-gray-400  text-sm sm:text-base"
												placeholder="2024"
											/>
										</div>
									</div>

									<div>
										<label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
											<span className="flex items-center gap-1.5">
												<DollarSign className="w-4 h-4" />
												Orçamento (Kz)
											</span>
										</label>
										<input
											type="text"
											className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl outline-none transition-all hover:border-gray-400  text-sm sm:text-base"
											placeholder="Ex: 5.000.000"
										/>
									</div>
								</div>

								<div>
									<label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
										<span className="flex items-center gap-1.5">
											<MapPin className="w-4 h-4" />
											Província preferida
										</span>
									</label>
									<select
										className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl outline-none transition-all hover:border-gray-400  bg-white cursor-pointer text-sm sm:text-base"
									>
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
									<label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
										Observações ou características específicas
									</label>
									<textarea
										rows="3"
										className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl outline-none resize-none transition-all hover:border-gray-400  text-sm sm:text-base"
										placeholder="Ex: Prefiro cor preta, com ar condicionado, câmbio automático..."
									/>
								</div>
							</div>

							{/* Botões de Ação */}
							<div className="pt-4 sm:pt-5 border-t border-gray-200 space-y-2.5 sm:space-y-3">
								<button
									type="submit"
									className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold py-3 sm:py-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
								>
									<Mail className="w-4 h-4 sm:w-5 sm:h-5" />
									Enviar Solicitação
								</button>
								<button
									type="button"
									onClick={() => setShowModal(false)}
									className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 sm:py-3 rounded-xl transition-all active:scale-[0.98] text-sm sm:text-base cursor-pointer"
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
