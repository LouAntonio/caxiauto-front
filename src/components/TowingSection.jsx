import React from 'react'
import { Truck, Gauge, Weight } from 'lucide-react'

export default function TowingSection() {
	const vehicles = [
		{
			id: 1,
			title: 'Reboque ligeiro',
			type: 'Reboque ligeiro',
			capacity: 'Até 3.5 Toneladas',
			specs: ['Assistência rápida', 'Transporte de ligeiros'],
			image: './images/reboque/reboqueLigeiro.png',
		},
		{
			id: 2,
			title: 'Reboque pesado',
			type: 'Reboque pesado',
			capacity: 'Até 40 Toneladas',
			specs: ['Plataforma pesada', 'Guincho hidráulico'],
			image: './images/reboque/reboquePesado.png',
		},
	]

	return (
		<section className="py-20 sm:py-28 bg-white">
			<div className="max-w-7xl mx-auto px-6 lg:px-8">
				<div className="mb-10">
					<h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111827] mb-2">Reboque</h2>
					<p className="font-body text-[#6b7280] max-w-2xl text-lg">Equipamentos de última geração para garantir a segurança do seu veículo em qualquer situação.</p>
				</div>

				<div className="flex flex-row gap-4 lg:gap-8 items-start">
					<div className="w-[280px] sm:w-[320px] lg:w-1/3 lg:sticky lg:top-6 flex-shrink-0">
						<div className="block">
							<img src="./images/reboque/reboque.png" alt="Reboque Caxiauto" />
						</div>
					</div>

					<div className="flex-1 min-w-0 overflow-hidden">
						<div className="flex flex-row lg:grid lg:grid-cols-2 gap-4 lg:gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x">
							{vehicles.map((vehicle) => (
								<div
									key={vehicle.id}
									className="group bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-[#d41120]/30 z-1 w-[280px] sm:w-[320px] lg:w-full flex-shrink-0 snap-start"
								>
									<div className="relative h-48 overflow-hidden bg-gray-100 p-2">
										<img
											src={vehicle.image}
											alt={vehicle.title}
											className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
										/>
										<div className="absolute top-3 right-3 bg-[#d41120]/90 text-white text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm">
											{vehicle.type}
										</div>
									</div>

									<div className="p-5">
										<h3 className="font-display font-bold text-lg text-[#111827] mb-1 group-hover:text-[#154c9a] transition-colors">
											{vehicle.title}
										</h3>

										<div className="flex items-center gap-4 mt-3 mb-4 text-xs text-[#6b7280] font-medium">
											<div className="flex items-center gap-1.5">
												<Weight size={14} className="text-[#d41120]" />
												{vehicle.capacity}
											</div>
											<div className="flex items-center gap-1.5">
												<Gauge size={14} className="text-[#d41120]" />
											Diesel
											</div>
										</div>

										<div className="flex flex-wrap gap-2">
											{vehicle.specs.map((spec, index) => (
												<span key={index} className="px-2 py-1 bg-[#eef3fa] text-[#154c9a] text-[10px] uppercase font-bold rounded-full border border-[#e5e7eb] font-body">
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
			</div>
		</section>
	)
}
