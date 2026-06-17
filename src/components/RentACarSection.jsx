import React, { useRef } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight, Tag } from 'lucide-react'
import { Link } from 'react-router-dom'

const categories = [
	{ id: 1, name: 'SUV', image: './images/rent/suv.png' },
	{ id: 2, name: 'Carrinha', image: './images/rent/carrinha.png' },
	{ id: 3, name: 'Sedan', image: './images/rent/sedan.png' },
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
		<section className="py-6">
			<div className="max-w-7xl mx-auto px-6 lg:px-8">
				<div className="flex flex-row gap-3 lg:gap-6">
					<div className="w-[250px] sm:w-[260px] lg:w-2/5 flex-shrink-0 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#d41120] to-[#a00d18] py-3 px-3 lg:py-4 lg:pr-0 lg:pl-4 shadow-sm flex flex-col justify-between group min-h-[140px] lg:min-h-[220px]">
						<div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

						<div className="z-10 relative">
							<div className="inline-flex items-center gap-1 bg-[#154c9a] text-white text-[10px] lg:text-xs font-bold px-2 py-1 lg:px-3 lg:py-1.5 rounded-full mb-2 lg:mb-4 uppercase tracking-wide font-body">
								<Tag size={10} />
								<span className="hidden sm:inline">Desconto</span>
								<span className="sm:hidden">-</span>
							</div>

							<h3 className="text-sm sm:text-base lg:text-2xl font-bold text-white leading-tight font-display">
								<span className="lg:hidden">Carros<br />para alugar</span>
								<span className="hidden lg:inline">Centenas de carros<br /> para alugar</span>
							</h3>

							<Link to="/servicos/aluguel-de-automoveis">
								<button className="group/btn mt-2 lg:mt-3 flex items-center gap-1 text-white font-bold border-b-2 border-white pb-0.5 w-fit hover:opacity-75 transition-opacity cursor-pointer font-body">
									<span className="text-xs lg:text-lg">Ver todos</span>
									<ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform lg:w-5 lg:h-5" />
								</button>
							</Link>
						</div>

						<div className="hidden lg:block absolute bottom-0 right-0 w-2/3 pointer-events-none">
							<img
								src="./images/rent/rent.webp"
								alt="Discounted Cars"
								className="w-full object-right object-contain drop-shadow-xl transform group-hover:scale-105 transition-transform duration-500 ease-out max-h-[220px]"
							/>
						</div>
					</div>

					<div className="flex-1 min-w-0 overflow-hidden">
						<div ref={carouselRef} className="flex gap-3 lg:gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x h-full">
							{categories.map((cat) => (
								<div
									key={cat.id}
									className="min-w-[110px] sm:min-w-[150px] lg:min-w-[200px] flex-1 bg-white border border-[#e5e7eb] rounded-2xl p-3 lg:p-4 flex flex-col items-center justify-between hover:border-[#154c9a]/20 hover:shadow-md transition-all duration-300 cursor-pointer snap-start"
								>
									<span className="font-display font-bold text-[#111827] mt-1 text-sm lg:text-base lg:mt-2">{cat.name}</span>
									<div className="my-2 lg:my-4 w-full aspect-video flex items-center justify-center">
										<img src={cat.image} alt={cat.name} onError={(e) => { e.target.src = './images/i10.png' }} className="max-w-full max-h-full object-contain mix-blend-multiply" />
									</div>
								</div>
							))}
							<div className="min-w-[56px] flex items-center justify-center">
								<Link to="/servicos/aluguel-de-automoveis">
									<button className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#f8f6f2] flex items-center justify-center text-[#6b7280] hover:bg-[#eef3fa] hover:text-[#154c9a] transition-colors cursor-pointer">
										<ArrowRight size={20} />
									</button>
								</Link>
							</div>
						</div>
					</div>
				</div>

				<div className="flex gap-2 mt-6">
					<button onClick={() => handleScroll('left')} className="w-10 h-10 border border-[#e5e7eb] rounded-2xl flex items-center justify-center text-[#154c9a] hover:bg-[#f8f6f2] hover:border-[#154c9a] transition-colors cursor-pointer">
						<ChevronLeft size={20} />
					</button>
					<button onClick={() => handleScroll('right')} className="w-10 h-10 border border-[#e5e7eb] rounded-2xl flex items-center justify-center text-[#154c9a] hover:bg-[#f8f6f2] hover:border-[#154c9a] transition-colors cursor-pointer">
						<ChevronRight size={20} />
					</button>
				</div>
			</div>
		</section>
	)
}
