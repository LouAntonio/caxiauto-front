import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Gauge, Calendar, MapPin, Droplet } from 'lucide-react';

const sampleCars = [
	{ id: 1, title: 'Toyota Corolla Altis', price: '7.500.000', km: '48.000 km', year: 2019, location: 'Luanda', img: './images/i10.jpg', fuel: 'Gasolina', condition: 'Usado' },
	{ id: 2, title: 'Honda Civic Touring', price: '9.250.000', km: '35.200 km', year: 2020, location: 'Luanda', img: './images/i10.jpg', fuel: 'Gasolina', condition: 'Usado' },
	{ id: 3, title: 'Volkswagen Polo', price: '5.890.000', km: '62.000 km', year: 2018, location: 'Benguela', img: './images/i10.jpg', fuel: 'Gasolina', condition: 'Usado' },
	{ id: 4, title: 'Hyundai HB20', price: '4.990.000', km: '74.500 km', year: 2017, location: 'Huambo', img: './images/i10.jpg', fuel: 'Gasolina', condition: 'Usado' },
	{ id: 5, title: 'Chevrolet Onix', price: '6.430.000', km: '41.100 km', year: 2019, location: 'Luanda', img: './images/i10.jpg', fuel: 'Gasolina', condition: 'Usado' },
	{ id: 6, title: 'Nissan Kicks', price: '8.200.000', km: '28.500 km', year: 2021, location: 'Luanda', img: './images/i10.jpg', fuel: 'Gasolina', condition: 'Novo' },
	{ id: 7, title: 'Ford Ranger', price: '12.500.000', km: '55.000 km', year: 2020, location: 'Benguela', img: './images/i10.jpg', fuel: 'Diesel', condition: 'Usado' },
	{ id: 8, title: 'Jeep Compass', price: '9.850.000', km: '32.800 km', year: 2021, location: 'Luanda', img: './images/i10.jpg', fuel: 'Gasolina', condition: 'Novo' },
];

export default function FeaturedCars({ title = 'Carros em Destaque' }) {
	const railRef = useRef(null);

	function scroll(dir = 1) {
		const rail = railRef.current;
		if (!rail) return;
		const cardWidth = 260;
		rail.scrollBy({ left: dir * (cardWidth * 2), behavior: 'smooth' });
	}

	return (
		<section className="pt-6 bg-gradient-to-b from-white to-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="flex items-center justify-between mb-8">
					<div>
						<h2 className="text-2xl font-bold text-gray-900">{title}</h2>
					</div>

					<div className="hidden md:flex gap-3">
						<button onClick={() => scroll(-1)} aria-label="Anterior" className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">
							<ChevronLeft className="w-5 h-5 text-gray-700" />
						</button>
						<button onClick={() => scroll(1)} aria-label="Próximo" className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">
							<ChevronRight className="w-5 h-5 text-gray-700" />
						</button>
					</div>
				</div>

				{/* Carousel */}
				<div className="relative">
					<div
						ref={railRef}
						className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
						style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
					>
						{sampleCars.map((car) => (
							<article
								key={car.id}
								className="flex-shrink-0 w-64 bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
							>
								{/* Imagem */}
								<div className="relative h-40 overflow-hidden">
									<img
										src={car.img}
										alt={car.title}
										className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
									/>

									{/* Badge de condição (Novo / Usado) */}
									<div className="absolute top-4 left-4">
										<span className={`px-3 py-1.5 text-xs font-semibold rounded-full shadow-lg ${car.condition === 'Novo' ? 'bg-blue-600 text-white' : 'bg-yellow-500 text-white'}`}>
											{car.condition}
										</span>
									</div>

									{/* Gradiente inferior */}
									<div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent"></div>
								</div>

								{/* Conteúdo */}
								<div className="p-5">
									<h3 className="text-1xl font-bold text-gray-900 mb-3 line-clamp-1 text-center">
										{car.title}
									</h3>

									{/* Preço */}
									<div
										style={{ color: 'var(--primary)' }}
										className="text-1xl font-bold mb-4 text-center"
									>
										{car.price},00 akz
									</div>

									{/* Especificações (duas colunas) */}
									<div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
										<div className="flex items-center justify-end gap-2">
											<span className="text-right">{car.km}</span>
											<Gauge className="w-4 h-4 text-gray-400" />
										</div>
										<div className="flex items-center gap-2">
											<Calendar className="w-4 h-4 text-gray-400" />
											<span>{car.year}</span>
										</div>
										<div className="flex items-center justify-end gap-2">
											<span className="text-right">{car.location}</span>
											<MapPin className="w-4 h-4 text-gray-400" />
										</div>
										<div className="flex items-center gap-2">
											<Droplet className="w-4 h-4 text-gray-400" />
											<span>{car.fuel}</span>
										</div>
									</div>

									{/* Botão */}
									<button
										style={{ backgroundColor: 'var(--secondary)' }}
										className="w-full mt-4 py-2 text-sm text-white font-semibold rounded-lg hover:opacity-90 transition-all shadow-sm"
									>
										Ver Detalhes
									</button>
								</div>
							</article>
						))}
					</div>

					{/* Botões mobile */}
					<div className="flex md:hidden gap-3 justify-center mt-6">
						<button onClick={() => scroll(-1)} aria-label="Anterior" className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">
							<ChevronLeft className="w-5 h-5 text-gray-700" />
						</button>
						<button onClick={() => scroll(1)} aria-label="Próximo" className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">
							<ChevronRight className="w-5 h-5 text-gray-700" />
						</button>
					</div>
				</div>

				{/* Link para ver todos */}
				<div className="text-center mt-10">
					<a
						href="/carros"
						style={{ color: 'var(--primary)' }}
						className="inline-flex items-center gap-2 font-semibold text-lg hover:underline"
					>
						Ver todos os veículos
						<ChevronRight className="w-5 h-5" />
					</a>
				</div>
			</div>

			<style jsx>{`
				.scrollbar-hide::-webkit-scrollbar {
					display: none;
				}
				.line-clamp-1 {
					display: -webkit-box;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}
			`}</style>
		</section>
	);
}
