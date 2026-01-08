import React from 'react'
import { Car, Clock, MapPin, Phone, Shield } from 'lucide-react'

export default function TowingSection() {
	const towingServices = [
		{
			id: 1,
			title: 'Disponibilidade 24/7',
			description: 'Estamos sempre prontos para lhe ajudar, a qualquer hora do dia ou da noite.',
			icon: <Clock className="w-6 h-6 text-[#e65100]" />,
		},
		{
			id: 2,
			title: 'Cobertura Nacional',
			description: 'Chegamos onde você estiver. Cobertura completa em todo o território.',
			icon: <MapPin className="w-6 h-6 text-[#e65100]" />,
		},
		{
			id: 3,
			title: 'Atendimento Rápido',
			description: 'Tempo de resposta otimizado para que você não fique esperando na estrada.',
			icon: <Phone className="w-6 h-6 text-[#e65100]" />,
		},
		{
			id: 4,
			title: 'Segurança Garantida',
			description: 'Profissionais treinados e equipamentos modernos para cuidar do seu veículo.',
			icon: <Shield className="w-6 h-6 text-[#e65100]" />,
		},
	]

	return (
		<section className="py-12 bg-white">
			<div className="max-w-7xl mx-auto px-6">
				<h2 className="text-3xl font-extrabold text-[#1a1a2e] mb-8">Reboque</h2>

				<div className="flex flex-col lg:flex-row gap-8 items-center">
					{/* Left: Car Illustration */}
					<div className="w-full lg:w-1/3 flex justify-center lg:justify-start">
						<div className="relative w-64 h-48 sm:w-80 sm:h-60 border-4 border-[#1a1a2e] rounded-xl flex items-center justify-center bg-gray-50 p-6 transform -rotate-2 hover:rotate-0 transition-transform duration-300">
							<Car strokeWidth={1} className="w-full h-full text-[#1a1a2e]" />
							<div className="absolute -bottom-4 -right-4 w-full h-full border-4 border-[#e65100] rounded-xl -z-10 bg-[#ffcd82]/30"></div>
						</div>
					</div>

					{/* Right: Info Blocks */}
					<div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
						{towingServices.map((service) => (
							<div
								key={service.id}
								className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white flex flex-col gap-3 group"
							>
								<div className="p-3 bg-orange-50 w-fit rounded-full group-hover:bg-[#e65100]/10 transition-colors">
									{service.icon}
								</div>
								<h3 className="font-bold text-lg text-[#1a1a2e]">{service.title}</h3>
								<p className="text-gray-600 text-sm">{service.description}</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}
