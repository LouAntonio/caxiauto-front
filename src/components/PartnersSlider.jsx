import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, Loader2 } from 'lucide-react';
import PartnerCardSkeleton from './PartnerCardSkeleton';
import { Link } from 'react-router-dom';
import api, { getImageUrl } from '../services/api';

export default function PartnersSlider() {
	const [partners, setPartners] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadPartners = async () => {
			try {
				const response = await api.listActivePartners({ limit: 4 });
				if (response.success) {
					setPartners(response.data);
				}
			} catch (error) {
				console.error('Erro ao carregar parceiros:', error);
			} finally {
				setLoading(false);
			}
		};

		loadPartners();
	}, []);

	if (loading) {
		return (
			<section className="py-12 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
							Nossos Parceiros
						</h2>
						<p className="text-gray-600 max-w-2xl mx-auto">
							Conheça as empresas que trabalham connosco para oferecer os melhores serviços e produtos.
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						<PartnerCardSkeleton count={4} />
					</div>
				</div>
			</section>
		);
	}

	if (partners.length === 0) {
		return null;
	}

	return (
		<section className="py-12 bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center mb-12">
					<h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
						Nossos Parceiros
					</h2>
					<p className="text-gray-600 max-w-2xl mx-auto">
						Conheça as empresas que trabalham connosco para oferecer os melhores serviços e produtos.
					</p>
				</div>

				{/* Partners Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					{partners.map((partner) => (
						<div key={partner.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
							{/* Banner */}
							{partner.banner ? (
								<div className="relative h-36 bg-gradient-to-b from-gray-200 to-gray-300 overflow-hidden">
									<img
										src={getImageUrl(partner.banner, null)}
										alt={`Banner ${partner.name}`}
										className="w-full h-full object-cover"
										onError={(e) => {
											e.target.style.display = 'none';
										}}
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
									<div className="absolute bottom-3 left-0 right-0 text-center">
										<span className="text-white font-semibold text-sm bg-black/20 px-3 py-1 rounded-full">{partner.name}</span>
									</div>
								</div>
							) : (
								<div className="relative h-36 bg-gradient-to-b from-gray-200 to-gray-300 flex items-center justify-center">
									<div className="absolute bottom-3 left-0 right-0 text-center">
										<span className="text-gray-700 font-semibold text-sm bg-white/60 px-3 py-1 rounded-full">{partner.name}</span>
									</div>
								</div>
							)}

							{/* Logo Circular - Entre banner e corpo */}
							<div className="relative -mt-16 flex justify-center z-10">
								<div className="w-28 h-28 rounded-full bg-white p-2 shadow-lg">
									<img
										src={getImageUrl(partner.logo, 'https://placehold.co/100x100/f3f4f6/1e293b?text=' + encodeURIComponent(partner.name.substring(0, 2)))}
										alt={partner.name}
										className="w-full h-full object-contain rounded-full"
										onError={(e) => {
											e.target.src = 'https://placehold.co/100x100/f3f4f6/1e293b?text=' + encodeURIComponent(partner.name.substring(0, 2));
										}}
									/>
								</div>
							</div>

							{/* Body */}
							<div className="p-5 pt-3 flex-grow flex flex-col">
								<h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{partner.name}</h3>

								{partner.characteristics && partner.characteristics.length > 0 && (
									<ul className="space-y-1 mb-4 flex-grow">
										{partner.characteristics.map((characteristic, index) => (
											<li key={index} className="flex items-start gap-2 text-sm text-gray-600">
												<span className="text-gray-400 mt-1">•</span>
												{characteristic}
											</li>
										))}
									</ul>
								)}

								{/* Logo CaxiAuto no centro */}
								<div className="flex justify-center my-4">
									<img
										src="/logo-caxiauto.png"
										alt="CaxiAuto"
										className="h-10 object-contain"
										onError={(e) => {
											e.target.style.display = 'none';
										}}
									/>
								</div>

								{/* Action Buttons */}
								<div className="grid grid-cols-2 gap-3 mt-auto">
									<a
										href={`https://wa.me/${partner.whatsapp.replace(/\s/g, '')}`}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2.5 px-3 rounded-lg text-sm font-medium transition-colors"
									>
										<MessageCircle size={16} />
										WhatsApp
									</a>
									<a
										href={`tel:${partner.phone}`}
										className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-3 rounded-lg text-sm font-medium transition-colors"
									>
										<Phone size={16} />
										Ligar
									</a>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Ver Mais Button */}
				<div className="text-center">
					<Link
						to="/parceiros"
						className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300"
					>
						Ver Mais
					</Link>
				</div>
			</div>
		</section>
	);
}
