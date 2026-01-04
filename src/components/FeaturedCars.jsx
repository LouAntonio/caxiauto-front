import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Gauge, Calendar, MapPin, Droplet } from 'lucide-react';

// Dados adaptados ao contexto angolano (preços em Kz, localidades angolanas)
const sampleCars = [
  { id: 1, title: 'Toyota Corolla Altis', price: 'Kz 7.500.000', km: '48.000 km', year: 2019, location: 'Luanda', img: 'https://source.unsplash.com/800x500/?toyota,corolla,angola', fuel: 'Gasolina', condition: 'Usado' },
  { id: 2, title: 'Honda Civic Touring', price: 'Kz 9.250.000', km: '35.200 km', year: 2020, location: 'Luanda', img: 'https://source.unsplash.com/800x500/?honda,civic,angola', fuel: 'Gasolina', condition: 'Usado' },
  { id: 3, title: 'Volkswagen Polo', price: 'Kz 5.890.000', km: '62.000 km', year: 2018, location: 'Benguela', img: 'https://source.unsplash.com/800x500/?volkswagen,polo,angola', fuel: 'Gasolina', condition: 'Usado' },
  { id: 4, title: 'Hyundai HB20', price: 'Kz 4.990.000', km: '74.500 km', year: 2017, location: 'Huambo', img: 'https://source.unsplash.com/800x500/?hyundai,hb20,angola', fuel: 'Gasolina', condition: 'Usado' },
  { id: 5, title: 'Chevrolet Onix', price: 'Kz 6.430.000', km: '41.100 km', year: 2019, location: 'Luanda', img: 'https://source.unsplash.com/800x500/?chevrolet,onix,angola', fuel: 'Gasolina', condition: 'Usado' },
  { id: 6, title: 'Nissan Kicks', price: 'Kz 8.200.000', km: '28.500 km', year: 2021, location: 'Luanda', img: 'https://source.unsplash.com/800x500/?nissan,kicks,angola', fuel: 'Gasolina', condition: 'Novo' },
  { id: 7, title: 'Ford Ranger', price: 'Kz 12.500.000', km: '55.000 km', year: 2020, location: 'Benguela', img: 'https://source.unsplash.com/800x500/?ford,ranger,angola', fuel: 'Diesel', condition: 'Usado' },
  { id: 8, title: 'Jeep Compass', price: 'Kz 9.850.000', km: '32.800 km', year: 2021, location: 'Luanda', img: 'https://source.unsplash.com/800x500/?jeep,compass,angola', fuel: 'Gasolina', condition: 'Novo' },
];

export default function FeaturedCars() {
	const railRef = useRef(null);

	function scroll(dir = 1) {
		const rail = railRef.current;
		if (!rail) return;
		const cardWidth = 320;
		rail.scrollBy({ left: dir * cardWidth, behavior: 'smooth' });
	}

	return (
		<section className="py-16 bg-gradient-to-b from-white to-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="flex items-center justify-between mb-8">
					<div>
						<h2 className="text-4xl font-bold text-gray-900">Carros em Destaque — Angola</h2>
						<p className="text-gray-600 mt-2">Veículos selecionados para Angola</p>
					</div>

					<div className="hidden md:flex gap-3">
						<button
							onClick={() => scroll(-1)}
							style={{ backgroundColor: 'var(--primary)' }}
							className="w-12 h-12 rounded-full text-white hover:opacity-90 transition-all flex items-center justify-center shadow-lg"
							aria-label="Anterior"
						>
							<ChevronLeft className="w-6 h-6" />
						</button>
						<button
							onClick={() => scroll(1)}
							style={{ backgroundColor: 'var(--primary)' }}
							className="w-12 h-12 rounded-full text-white hover:opacity-90 transition-all flex items-center justify-center shadow-lg"
							aria-label="Próximo"
						>
							<ChevronRight className="w-6 h-6" />
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
								className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
							>
								{/* Imagem */}
								<div className="relative h-52 overflow-hidden">
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
									<h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1">
										{car.title}
									</h3>

									{/* Preço */}
									<div
										style={{ color: 'var(--primary)' }}
										className="text-3xl font-bold mb-4"
									>
										{car.price}
									</div>

									{/* Especificações */}
									<div className="space-y-2.5">
										<div className="flex items-center gap-2 text-sm text-gray-600">
											<Gauge className="w-4 h-4 text-gray-400" />
											<span>{car.km}</span>
										</div>
										<div className="flex items-center gap-2 text-sm text-gray-600">
											<Calendar className="w-4 h-4 text-gray-400" />
											<span>{car.year}</span>
										</div>
										<div className="flex items-center gap-2 text-sm text-gray-600">
											<MapPin className="w-4 h-4 text-gray-400" />
											<span>{car.location}</span>
										</div>
										<div className="flex items-center gap-2 text-sm text-gray-600">
											<Droplet className="w-4 h-4 text-gray-400" />
											<span>{car.fuel}</span>
										</div>
									</div>

									{/* Botão */}
									<button
										style={{ backgroundColor: 'var(--secondary)' }}
										className="w-full mt-5 py-3 text-white font-semibold rounded-xl hover:opacity-90 transition-all transform hover:scale-[1.02] shadow-md"
									>
										Ver Detalhes
									</button>
								</div>
							</article>
						))}
					</div>

					{/* Botões mobile */}
					<div className="flex md:hidden gap-3 justify-center mt-6">
						<button
							onClick={() => scroll(-1)}
							style={{ backgroundColor: 'var(--primary)' }}
							className="w-12 h-12 rounded-full text-white hover:opacity-90 transition-all flex items-center justify-center shadow-lg"
							aria-label="Anterior"
						>
							<ChevronLeft className="w-6 h-6" />
						</button>
						<button
							onClick={() => scroll(1)}
							style={{ backgroundColor: 'var(--primary)' }}
							className="w-12 h-12 rounded-full text-white hover:opacity-90 transition-all flex items-center justify-center shadow-lg"
							aria-label="Próximo"
						>
							<ChevronRight className="w-6 h-6" />
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
