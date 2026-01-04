import React from 'react';
import { Car, CheckCircle, Gauge, Star, Shield } from 'lucide-react';

export default function TrustedVehicles() {
	return (
		<section className="pt-4 bg-gradient-to-b from-gray-50 to-white">
			<div className="max-w-7xl mx-auto">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
					{/* Card Preview */}
					<div className="order-2 lg:order-1">
						<div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
							{/* Header com imagem real */}
							<div className="relative h-56 overflow-hidden bg-gray-100">
								<img
									className="absolute inset-0 w-full h-full object-cover"
									src="./images/i10.jpg"
									alt="Hyundai i10"
								/>
								<div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
									<Shield className="w-4 h-4" />
									Verificado
								</div>
							</div>

							{/* Conteúdo */}
							<div className="p-8">
								<h3 className="text-xl font-bold text-gray-900 mb-6">
									Hyundai i10 2016
								</h3>

								{/* Avaliações */}
								<div className="space-y-4">
									<div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
												<Car className="w-5 h-5 text-blue-600" />
											</div>
											<span className="font-medium text-gray-700">Exterior</span>
										</div>
										<div className="flex gap-1">
											{[...Array(5)].map((_, i) => (
												<div key={i} className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
											))}
										</div>
									</div>

									<div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
												<Star className="w-5 h-5 text-blue-600" />
											</div>
											<span className="font-medium text-gray-700">Interior</span>
										</div>
										<div className="flex gap-1">
											{[...Array(5)].map((_, i) => (
												<div key={i} className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
											))}
										</div>
									</div>

									<div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
												<Gauge className="w-5 h-5 text-blue-600" />
											</div>
											<span className="font-medium text-gray-700">Motor</span>
										</div>
										<div className="flex gap-1">
											{[...Array(4)].map((_, i) => (
												<div key={i} className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
											))}
											<div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
										</div>
									</div>

									<div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
												<Car className="w-5 h-5 text-blue-600" />
											</div>
											<span className="font-medium text-gray-700">Testdrive</span>
										</div>
										<div className="flex gap-1">
											{[...Array(5)].map((_, i) => (
												<div key={i} className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
											))}
										</div>
									</div>
								</div>

								{/* Badge final */}
								<div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
									<div className="flex items-center gap-3">
										<CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
										<div>
											<p className="text-sm text-gray-700">
												Verificados todos os <span className="font-bold text-green-700">270 pontos</span>
											</p>
											<p className="text-xs text-gray-500 mt-1">Inspeção completa realizada</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Informações */}
					<div className="order-1 lg:order-2 space-y-6">
						<div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
							<Shield className="w-4 h-4" />
							Certificação de Qualidade
						</div>

						<h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
							Veículos de confiança
							<span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
								verificados por nós
							</span>
						</h2>

						<p className="text-lg text-gray-600 leading-relaxed">
							Mecânicos qualificados inspecionam cada veículo em <strong>270 pontos de verificação</strong>.
							Receba um relatório detalhado sobre o estado técnico, documentação fotográfica completa
							e recomendações personalizadas para sua decisão de compra.
						</p>

						{/* Features */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
							<div className="flex items-start gap-3">
								<div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
									<CheckCircle className="w-5 h-5 text-blue-600" />
								</div>
								<div>
									<h4 className="font-semibold text-gray-900">Inspeção Completa</h4>
									<p className="text-sm text-gray-600 mt-1">270 pontos verificados</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
									<Star className="w-5 h-5 text-blue-600" />
								</div>
								<div>
									<h4 className="font-semibold text-gray-900">Relatório Detalhado</h4>
									<p className="text-sm text-gray-600 mt-1">Com fotos e análises</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
