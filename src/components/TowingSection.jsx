import React from 'react'
import { Weight, Gauge } from 'lucide-react'

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
		<section className="py-16 bg-white">
			<div className="max-w-7xl mx-auto px-6 lg:px-8">
				<div className="mb-8">
					<h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111827] mb-2">Reboque</h2>
					<div className="w-12 h-[3px] bg-[#d41120] rounded-full mb-4" />
					<p className="font-body text-[#6b7280] max-w-2xl text-lg">Equipamentos de última geração para garantir a segurança do seu veículo em qualquer situação.</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{vehicles.map((vehicle) => (
						<div
							key={vehicle.id}
							className="group relative h-64 bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
						>
							<img
								src={vehicle.image}
								alt={vehicle.title}
								className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

							<div className="absolute top-3 right-3 bg-[#d41120] text-white text-xs font-bold px-3 py-1 rounded-full z-10">
								{vehicle.type}
							</div>

							<div className="absolute bottom-0 left-0 right-0 p-5 z-10">
								<h3 className="font-display font-bold text-lg text-white mb-1">
									{vehicle.title}
								</h3>

								<div className="flex items-center gap-4 mt-2 mb-2 text-xs text-white/80 font-medium">
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
										<span key={index} className="px-2 py-1 bg-white/20 text-white text-[10px] uppercase font-bold rounded-full border border-white/30 font-body">
											{spec}
										</span>
									))}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
