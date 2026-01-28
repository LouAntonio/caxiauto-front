import React, { useRef } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight, Tag } from 'lucide-react'


// Placeholder images for cars - in a real app these would be assets
const CAR_PLACEHOLDER = "https://placehold.co/400x250/png?text=Carro"

const categories = [
	{ id: 1, name: 'SUV', image: CAR_PLACEHOLDER },
	{ id: 2, name: 'Family car', image: CAR_PLACEHOLDER },
	{ id: 3, name: 'Estate', image: CAR_PLACEHOLDER },
	{ id: 4, name: 'Hatchback', image: CAR_PLACEHOLDER },
]

export default function RentACarSection() {
	const carouselRef = useRef(null)

	function handleScroll(direction = 'right') {
		if (!carouselRef.current) return
		const el = carouselRef.current
		const scrollAmount = Math.round(el.clientWidth * 0.7) * (direction === 'right' ? 1 : -1)
		el.scrollBy({ left: scrollAmount, behavior: 'smooth' })
	}
	return (
		<section className="py-6 section-rent-a-car">
			<div className="flex flex-col lg:flex-row gap-6">
				{/* Left Promo Card */}
				<div className="lg:w-2/5 flex-shrink-0 relative overflow-hidden rounded-xl bg-gradient-to-br from-[#ffcd82] to-[#ffb142] py-4 pr-0 pl-4 shadow-sm min-h-[220px] flex flex-col justify-between group">

					{/* Decorative shapes */}
					<div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

					<div className="z-10 relative">
						<div className="inline-flex items-center gap-1.5 bg-[#e65100] text-white text-xs font-bold px-3 py-1.5 rounded-md mb-4 uppercase tracking-wide">
							<Tag size={12} />
							Desconto
						</div>

						<h3 className="text-2xl font-extrabold text-[#1a1a2e] leading-tight">
							Centenas de carros<br /> para alugar
						</h3>

						<button className="group/btn mt-3 flex items-center gap-2 text-[#1a1a2e] font-bold border-b-2 border-[#1a1a2e] pb-0.5 w-fit hover:opacity-75 transition-opacity cursor-pointer">
							<span className="text-lg">Veja todos</span>
							<ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
						</button>
					</div>

					{/* Car Image Overlay - mimicking the two cars in the reference */}
					<div className="absolute bottom-0 right-0 w-2/3 pointer-events-none">
						{/* Using a placeholder that looks like a car cutout if possible, or just the rect */}
						<img
							src="./images/rent/rent.webp"
							alt="Discounted Cars"
							className="w-full object-right object-contain drop-shadow-xl transform group-hover:scale-105 transition-transform duration-500 ease-out max-h-[160px]"
						/>
					</div>
				</div>

				{/* Right Categories Carousel */}
				<div className="lg:w-3/5 overflow-hidden">
					<div ref={carouselRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
						{categories.map((cat) => (
							<div
								key={cat.id}
								className="min-w-[200px] flex-1 bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-between hover:shadow-md transition-shadow cursor-pointer snap-start"
							>
								<span className="font-bold text-[#1a1a2e] mt-2">{cat.name}</span>
								<div className="my-4 w-full aspect-video flex items-center justify-center">
								<img src={cat.image} alt={cat.name} onError={(e) => { e.target.src = './images/i10.png' }} className="max-w-full max-h-full object-contain mix-blend-multiply" />
								</div>
							</div>
						))}
						{/* Add an extra empty card or 'See all' if needed to fill space */}
						<div className="min-w-[100px] flex items-center justify-center">
							<button className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors">
								<ArrowRight size={24} />
							</button>
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
