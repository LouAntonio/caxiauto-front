import React, { useRef } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight, Tag } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'


// Placeholder images for cars - in a real app these would be assets
const CAR_PLACEHOLDER = "https://placehold.co/400x250/png?text=Carro"

const categories = [
	{ id: 1, name: 'SUV', image: './images/rent/suv.png' },
	{ id: 2, name: 'Carrinha', image: './images/rent/carrinha.png' },
	{ id: 3, name: 'Sedan', image: './images/rent/sedan.png' },
]

export default function RentACarSection() {
	const carouselRef = useRef(null)
	const navigate = useNavigate();

	function handleScroll(direction = 'right') {
		if (!carouselRef.current) return
		const el = carouselRef.current
		const scrollAmount = Math.round(el.clientWidth * 0.7) * (direction === 'right' ? 1 : -1)
		el.scrollBy({ left: scrollAmount, behavior: 'smooth' })
	}
	return (
		<section className="py-6 section-rent-a-car">
			<div className="flex flex-row gap-3 lg:gap-6">
				{/* Left Promo Card — compact on mobile, wider on desktop */}
				<div className="w-[250px] sm:w-[260px] lg:w-2/5 flex-shrink-0 relative overflow-hidden rounded-xl bg-gradient-to-br from-[#ffcd82] to-[#ffb142] py-3 px-3 lg:py-4 lg:pr-0 lg:pl-4 shadow-sm flex flex-col justify-between group min-h-[140px] lg:min-h-[220px]">

					{/* Decorative shapes */}
					<div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

					<div className="z-10 relative">
						<div className="inline-flex items-center gap-1 bg-[#e65100] text-white text-[10px] lg:text-xs font-bold px-2 py-1 lg:px-3 lg:py-1.5 rounded-md mb-2 lg:mb-4 uppercase tracking-wide">
							<Tag size={10} />
							<span className="hidden sm:inline">Desconto</span>
							<span className="sm:hidden">-</span>
						</div>

						<h3 className="text-sm sm:text-base lg:text-2xl font-extrabold text-[#1a1a2e] leading-tight">
							<span className="lg:hidden">Carros<br />para alugar</span>
							<span className="hidden lg:inline">Centenas de carros<br /> para alugar</span>
						</h3>

						<Link to="/servicos/aluguel-de-automoveis">
							<button
								className="group/btn mt-2 lg:mt-3 flex items-center gap-1 text-[#1a1a2e] font-bold border-b-2 border-[#1a1a2e] pb-0.5 w-fit hover:opacity-75 transition-opacity cursor-pointer"
							>
								<span className="text-xs lg:text-lg">Ver todos</span>
								<ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform lg:w-5 lg:h-5" />
							</button>
						</Link>
					</div>

					{/* Car Image — hidden on mobile to keep the card compact */}
					<div className="hidden lg:block absolute bottom-0 right-0 w-2/3 pointer-events-none">
						<img
							src="./images/rent/rent.webp"
							alt="Discounted Cars"
							className="w-full object-right object-contain drop-shadow-xl transform group-hover:scale-105 transition-transform duration-500 ease-out max-h-[220px]"
						/>
					</div>
				</div>

				{/* Right Categories Carousel */}
				<div className="flex-1 min-w-0 overflow-hidden">
					<div ref={carouselRef} className="flex gap-3 lg:gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x h-full">
						{categories.map((cat) => (
							<div
								key={cat.id}
								className="min-w-[110px] sm:min-w-[150px] lg:min-w-[200px] flex-1 bg-white border border-gray-200 rounded-xl p-3 lg:p-4 flex flex-col items-center justify-between hover:shadow-md transition-shadow cursor-pointer snap-start"
							>
								<span className="font-bold text-[#1a1a2e] mt-1 text-sm lg:text-base lg:mt-2">{cat.name}</span>
								<div className="my-2 lg:my-4 w-full aspect-video flex items-center justify-center">
									<img src={cat.image} alt={cat.name} onError={(e) => { e.target.src = './images/i10.png' }} className="max-w-full max-h-full object-contain mix-blend-multiply" />
								</div>
							</div>
						))}
						<div className="min-w-[56px] flex items-center justify-center">
							<Link to="/servicos/aluguel-de-automoveis">
								<button
									className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors cursor-pointer"
								>
									<ArrowRight size={20} />
								</button>
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* Navigation Controls */}
			<div className="flex gap-2 mt-6">
				<button onClick={() => handleScroll('left')} className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center text-blue-900 hover:bg-gray-50 hover:border-blue-900 transition-colors">
					<ChevronLeft size={20} />
				</button>
				<button onClick={() => handleScroll('right')} className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center text-blue-900 hover:bg-gray-50 hover:border-blue-900 transition-colors">
					<ChevronRight size={20} />
				</button>
			</div>
		</section>
	)
}
