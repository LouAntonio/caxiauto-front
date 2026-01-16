import React from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { Phone, MessageCircle, Check } from 'lucide-react';

const partners = [
	{
		id: 1,
		name: "Toyota de Angola - Peças",
		image: "/images/partners/toyota-bg.jpg", // Placeholder - user should replace
		phone: "923 190 809",
		services: ["Peças genuínas", "Manutenção", "Toyota"],
		logo: "/images/logos/LogoOficialCrooped.png" // Using existing logo as placeholder if specific one not available
	},
	{
		id: 2,
		name: "Tecniclean",
		image: "/images/partners/cleaning-bg.jpg", // Placeholder
		phone: "923 000 000",
		services: ["Serviços de desinfecção", "Higiene", "Limpeza profunda"],
		logo: "/images/logos/LogoOficialCrooped.png"
	},
	{
		id: 3,
		name: "Tracker",
		image: "/images/partners/tracker-bg.jpg", // Placeholder
		phone: "923 000 000",
		services: ["Instalação de GPS", "Manutenção de GPS", "Recebe Alertas como SOS"],
		logo: "/images/logos/LogoOficialCrooped.png"
	},
	{
		id: 4,
		name: "DrPeçasangola",
		image: "/images/partners/parts-bg.jpg", // Placeholder
		phone: "923 000 000",
		services: ["Automóveis Ligeiros e Pesados", "Motorizadas e Barcos"],
		logo: "/images/logos/LogoOficialCrooped.png"
	}
];

export default function Parceiros() {
	useDocumentTitle('Parceiros - Caxiauto');

	return (
		<main className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">Nossos Parceiros</h1>
					<p className="text-lg text-gray-600 max-w-2xl mx-auto">
						Conheça as empresas que trabalham connosco para oferecer os melhores serviços e produtos.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{partners.map((partner) => (
						<div key={partner.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
							{/* Image Header with Badge */}
							<div className="relative h-48 bg-gray-200">
								<img
									src={partner.image}
									alt={partner.name}
									className="w-full h-full object-cover"
									onError={(e) => {
										e.target.src = 'https://placehold.co/600x400/e2e8f0/1e293b?text=' + encodeURIComponent(partner.name);
									}}
								/>

								{/* Overlay Content */}
								<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
									<div className="flex items-center gap-2 mt-2">
										<div className="bg-red-600 px-3 py-1 rounded-full flex items-center gap-2 text-sm font-bold">
											<Phone size={14} />
											<span>{partner.phone}</span>
										</div>
									</div>
								</div>
							</div>

							{/* Body */}
							<div className="p-4 flex-grow flex flex-col">
								<h3 className="text-xl font-bold text-gray-900 mb-3">{partner.name}</h3>

								<ul className="space-y-1 mb-4 flex-grow">
									{partner.services.map((service, index) => (
										<li key={index} className="flex items-start gap-2 text-sm text-gray-600">
											<div className="mt-1 min-w-[4px] h-[4px] bg-gray-400 rounded-full" />
											{service}
										</li>
									))}
								</ul>

								{/* Logo */}
								<div className="h-12 mb-4 flex items-center justify-center">
									<img
										src={partner.logo}
										alt={`${partner.name} logo`}
										className="h-full object-contain max-w-[120px]"
										onError={(e) => {
											e.target.style.display = 'none';
										}}
									/>
								</div>

								{/* Action Buttons */}
								<div className="grid grid-cols-2 gap-3 mt-auto">
									<a
										href={`https://wa.me/${partner.phone.replace(/\s/g, '')}`}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors"
									>
										<MessageCircle size={16} />
										WhatsApp
									</a>
									<a
										href={`tel:${partner.phone}`}
										className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors"
									>
										<Phone size={16} />
										Ligar
									</a>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</main>
	);
}
