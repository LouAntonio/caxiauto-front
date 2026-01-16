import React, { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const sampleParts = [
	{
		id: 1,
		title: 'Filtro de Óleo Bosch',
		price: '3200',
		category: 'Motor',
		sub: 'Filtros',
		badges: ['Original', 'Promoção'],
		img: './images/parts.jpg',
	},
	{
		id: 2,
		title: 'Pastilhas de Freio Brembo',
		price: '4800',
		category: 'Freios',
		sub: 'Pastilhas',
		badges: ['Mais Vendida'],
		img: './images/parts.jpg',
	},
	{
		id: 3,
		title: 'Amortecedor Monroe',
		price: '6900',
		category: 'Suspensão',
		sub: 'Amortecedores',
		badges: ['Paralela'],
		img: './images/parts.jpg',
	},
	{
		id: 4,
		title: 'Radiador Alta Performance',
		price: '18500',
		category: 'Arrefecimento',
		sub: 'Radiadores',
		badges: ['Importada'],
		img: './images/parts.jpg',
	},
	{
		id: 5,
		title: 'Bateria Exide 60Ah',
		price: '9200',
		category: 'Elétrica & Eletrônica',
		sub: 'Baterias',
		badges: ['Original', 'Novo'],
		img: './images/parts.jpg',
	},
	{
		id: 6,
		title: 'Correia Dentada Gates',
		price: '7500',
		category: 'Motor',
		sub: 'Correias',
		badges: ['Original'],
		img: './images/parts.jpg',
	},
	{
		id: 7,
		title: 'Velas NGK (jogo)',
		price: '2100',
		category: 'Motor',
		sub: 'Velas',
		badges: ['Paralela', 'Promoção'],
		img: './images/parts.jpg',
	},
	{
		id: 8,
		title: 'Alternador Valeo',
		price: '11200',
		category: 'Elétrica & Eletrônica',
		sub: 'Alternadores',
		badges: ['Importada', 'Mais Vendida'],
		img: './images/parts.jpg',
	},
]

export default function FeaturedParts() {
	const railRef = useRef(null)

	function scroll(dir = 1) {
		const rail = railRef.current
		if (!rail) return
		const step = Math.round(rail.clientWidth * 0.8)
		rail.scrollBy({ left: dir * step, behavior: 'smooth' })
	}

	return (
		<section className="parts-section py-6">
			<div className="max-w-7xl mx-auto px-4">
				<div className="flex items-center justify-between mb-6">
					<div className="flex gap-3 items-baseline">
						<h2 className="text-2xl font-semibold">Peças e Acessórios</h2>
						<span className="text-gray-400 text-2xl">|</span>
						<a
							href="/pecas"
							style={{ color: 'var(--primary)' }}
							className="group flex items-center gap-1 text-lg font-medium hover:underline"
						>
							Ver todas
							<ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
						</a>
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

				<div ref={railRef} className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4">
					{sampleParts.map((p) => (
						<article key={p.id} className="flex-shrink-0 w-64 bg-white rounded-2xl shadow-lg overflow-hidden group">
							<div className="relative h-36 overflow-hidden">
								<img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
								<div className="absolute top-3 left-3 flex gap-2">
									{p.badges.map((b) => (
										<span key={b} className="badge px-2 py-0.5 text-xs font-semibold rounded">{b}</span>
									))}
								</div>
							</div>

							<div className="p-4">
								<h3 className="text-sm font-semibold line-clamp-2">{p.title}</h3>
								<div className="text-primary font-bold mt-2 mb-3">{parseInt(p.price).toFixed(2)} akz</div>

								<div className="flex items-center justify-between text-sm text-gray-600">
									<div className="flex items-center gap-2">
										<span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{p.category}</span>
										<span className="text-xs text-gray-500">/</span>
										<span className="text-xs text-gray-500">{p.sub}</span>
									</div>
								</div>
								<button style={{ backgroundColor: 'var(--secondary)' }} className="text-white px-3 py-2 rounded-md text-xs font-semibold hover:opacity-90 mt-4 w-full">
									Ver Detalhes
								</button>
							</div>
						</article>
					))}
				</div>


			</div>
		</section>
	)
}

