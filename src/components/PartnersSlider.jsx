import React from 'react';

const partners = [
	{ id: 1, name: 'Toyota', logo: '/images/logos/LogoOficialCrooped.png' },
	{ id: 2, name: 'Honda', logo: '/images/logos/LogoOficialCrooped.png' },
	{ id: 3, name: 'Volkswagen', logo: '/images/logos/LogoOficialCrooped.png' },
	{ id: 4, name: 'Hyundai', logo: '/images/logos/LogoOficialCrooped.png' },
	{ id: 5, name: 'Nissan', logo: '/images/logos/LogoOficialCrooped.png' },
	{ id: 6, name: 'Ford', logo: '/images/logos/LogoOficialCrooped.png' },
	{ id: 7, name: 'Chevrolet', logo: '/images/logos/LogoOficialCrooped.png' },
	{ id: 8, name: 'Mercedes', logo: '/images/logos/LogoOficialCrooped.png' },
	{ id: 9, name: 'BMW', logo: '/images/logos/LogoOficialCrooped.png' },
	{ id: 10, name: 'Audi', logo: '/images/logos/LogoOficialCrooped.png' },
];

export default function PartnersSlider() {
	return (
		<section className="py-16 bg-white overflow-hidden">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center mb-12">
					<h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
						Nossos Parceiros
					</h2>
					<p className="text-gray-600 max-w-2xl mx-auto">
						Trabalhamos com as marcas mais confiáveis do mercado automobilístico
					</p>
				</div>

				{/* Slider Container */}
				<div className="relative">
					{/* Slider */}
					<div className="slider-container">
						<div className="slider-track">
							{/* Primeiro conjunto de logos */}
							{partners.map((partner) => (
								<div
									key={`first-${partner.id}`}
									className="slider-item"
								>
									<div className="partner-card">
										<img
											src={partner.logo}
											alt={partner.name}
											className="partner-logo"
											onError={(e) => {
												e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100"%3E%3Crect fill="%23f0f0f0" width="200" height="100"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-family="Arial" font-size="16"%3E' + partner.name + '%3C/text%3E%3C/svg%3E';
											}}
										/>
									</div>
								</div>
							))}

							{/* Segundo conjunto de logos (duplicado para scroll infinito) */}
							{partners.map((partner) => (
								<div
									key={`second-${partner.id}`}
									className="slider-item"
								>
									<div className="partner-card">
										<img
											src={partner.logo}
											alt={partner.name}
											className="partner-logo"
											onError={(e) => {
												e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100"%3E%3Crect fill="%23f0f0f0" width="200" height="100"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-family="Arial" font-size="16"%3E' + partner.name + '%3C/text%3E%3C/svg%3E';
											}}
										/>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			<style jsx>{`
				.slider-container {
					overflow: hidden;
					width: 100%;
				}

				.slider-track {
					display: flex;
					animation: scroll 40s linear infinite;
					width: fit-content;
				}

				.slider-track:hover {
					animation-play-state: paused;
				}

				.slider-item {
					flex: 0 0 auto;
					padding: 0 1rem;
				}

				.partner-card {
					width: 180px;
					height: 100px;
					background: white;
					border-radius: 1rem;
					padding: 1.5rem;
					display: flex;
					align-items: center;
					justify-content: center;
					transition: all 0.3s ease;
				}

				.partner-card:hover {
					transform: translateY(-4px);
				}

				.partner-logo {
					max-width: 100%;
					max-height: 100%;
					object-fit: contain;
					filter: grayscale(100%) opacity(0.6);
					transition: filter 0.3s ease;
				}

				.partner-card:hover .partner-logo {
					filter: grayscale(0%) opacity(1);
				}

				@keyframes scroll {
					0% {
						transform: translateX(0);
					}
					100% {
						transform: translateX(-50%);
					}
				}

				/* Pausa a animação quando qualquer card é hover */
				.slider-track:has(.partner-card:hover) {
					animation-play-state: paused;
				}

				/* Responsive */
				@media (max-width: 768px) {
					.slider-track {
						animation-duration: 30s;
					}

					.partner-card {
						width: 140px;
						height: 80px;
						padding: 1rem;
					}
				}
			`}</style>
		</section>
	);
}
