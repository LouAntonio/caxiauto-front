import React from 'react'
import { Truck, Check, Gauge, Weight } from 'lucide-react'

// Placeholder for tow truck images
const TOW_TRUCK_1 = "https://placehold.co/600x400/e65100/white?text=Reboque+Ligeiro"
const TOW_TRUCK_2 = "https://placehold.co/600x400/1a1a2e/white?text=Plataforma+Pesados"

export default function TowingSection() {
	const vehicles = [
		{
			id: 1,
			title: 'Reboque ligeiro',
			type: 'Reboque ligeiro',
			capacity: 'Até 3.5 Toneladas',
			specs: ['Assistência rápida', 'Transporte de ligeiros'],
			image: TOW_TRUCK_1,
		},
		{
			id: 2,
			title: 'Reboque pesado',
			type: 'Reboque pesado',
			capacity: 'Até 40 Toneladas',
			specs: ['Plataforma pesada', 'Guincho hidráulico'],
			image: TOW_TRUCK_2,
		},
	]

	return (
		<section className="py-6 bg-white">
			<div className="max-w-7xl mx-auto px-6">
				<div className="mb-10">
					<h2 className="text-3xl font-extrabold text-[#1a1a2e] mb-2">Reboque</h2>
					<p className="text-gray-500 max-w-2xl">Equipamentos de última geração para garantir a segurança do seu veículo em qualquer situação.</p>
				</div>

				<div className="flex flex-col lg:flex-row gap-8 items-start">
					{/* Left: Main Feature / Active Fleet Overview */}
					<div className="w-full lg:w-1/3 sticky top-6">
						<div className="bg-[#1a1a2e] text-white rounded-2xl p-8 overflow-hidden relative min-h-[400px] flex flex-col justify-between">
							<div className="absolute top-0 right-0 w-64 h-64 bg-[#e65100] rounded-full filter blur-[80px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>

							<div className="relative z-10">
								<div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
									<div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
									Disponível 24/7
								</div>

								<h3 className="text-3xl font-bold mb-4">Prontos para qualquer desafio</h3>
								<p className="text-gray-300 mb-8">
									A nossa frota é composta por veículos modernos e inspecionados, operados por profissionais certificados. Desde ligeiros a camiões de grande porte.
								</p>

								<ul className="space-y-3">
									<li className="flex items-center gap-3 text-sm font-medium">
										<Check className="text-[#e65100] w-5 h-5" />
										Tempo médio de chegada: 30 min
									</li>
									<li className="flex items-center gap-3 text-sm font-medium">
										<Check className="text-[#e65100] w-5 h-5" />
										Rastreamento em tempo real
									</li>
									<li className="flex items-center gap-3 text-sm font-medium">
										<Check className="text-[#e65100] w-5 h-5" />
										Seguro de transporte incluído
									</li>
								</ul>
							</div>

							<div className="mt-8 pt-8 border-t border-white/10 flex justify-between items-end">
								<div>
									<span className="block text-4xl font-bold text-[#e65100]">15+</span>
									<span className="text-sm text-gray-400">Veículos</span>
								</div>
								<Truck className="w-12 h-12 text-gray-600 opacity-50" />
							</div>
						</div>
					</div>

					{/* Right: Vehicle Cards Grid */}
					<div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
						{vehicles.map((vehicle) => (
							<div
								key={vehicle.id}
								className="group bg-white border border-[#ccc] rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-[#e65100]/30 z-1"
							>
								{/* Image Area */}
								<div className="relative h-48 overflow-hidden bg-gray-100">
									<img
										src={vehicle.image}
										alt={vehicle.title}
										className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
									/>
									<div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded">
										{vehicle.type}
									</div>
								</div>

								{/* Content */}
								<div className="p-5">
									<h3 className="font-bold text-lg text-[#1a1a2e] mb-1 group-hover:text-[#e65100] transition-colors">
										{vehicle.title}
									</h3>

									<div className="flex items-center gap-4 mt-3 mb-4 text-xs text-gray-500 font-medium">
										<div className="flex items-center gap-1.5">
											<Weight size={14} className="text-[#e65100]" />
											{vehicle.capacity}
										</div>
										<div className="flex items-center gap-1.5">
											<Gauge size={14} className="text-[#e65100]" />
											Diesel
										</div>
									</div>

									<div className="flex flex-wrap gap-2">
										{vehicle.specs.map((spec, index) => (
											<span key={index} className="px-2 py-1 bg-gray-50 text-gray-600 text-[10px] uppercase font-bold rounded border border-gray-100">
												{spec}
											</span>
										))}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}
