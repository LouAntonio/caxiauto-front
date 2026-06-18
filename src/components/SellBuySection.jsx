import React from 'react'
import { Link } from 'react-router-dom'

export default function SellBuySection() {
	return (
		<section className="my-8">
			<div className="max-w-7xl mx-auto px-6 lg:px-8">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="bg-gradient-to-br from-[#154c9a] to-[#123f80] rounded-2xl p-8 sm:p-12 relative overflow-visible text-white">
						<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d41120] text-white text-xs font-semibold font-body mb-4">
							Até 24h
						</div>
						<div className="relative z-10 max-w-sm">
							<h2 className="font-display text-2xl md:text-3xl font-bold mb-8 leading-tight">
								Venda o seu carro mais rápido!
							</h2>
							<Link to="/venda-seu-automovel">
								<button className="bg-white hover:bg-blue-50 text-[#154c9a] font-semibold px-8 py-3 rounded-2xl transition-all duration-300 cursor-pointer font-body">
									Saber mais
								</button>
							</Link>
						</div>
						<img
							src="/images/FireRed-1-768x528.png.webp"
							alt="Suzuki S-Presso"
							className="absolute bottom-0 right-0 w-2/3 max-w-[300px] md:max-w-[400px] object-contain -translate-x-4 translate-y-6"
						/>
					</div>

					<div className="bg-[#111827] rounded-2xl p-8 sm:p-12 text-white flex flex-col justify-center">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
							<div>
								<h2 className="font-display text-2xl md:text-3xl font-bold leading-tight mb-2">
									Como comprar
								</h2>
								<h2 className="font-display text-2xl md:text-3xl font-bold leading-tight">
									um carro?
								</h2>
							</div>

							<div className="space-y-5">
								{[
									{ num: 1, text: 'Pesquise o carro' },
									{ num: 2, text: 'Compare opções' },
									{ num: 3, text: 'Inicie as negociações' },
								].map((item) => (
									<div key={item.num} className="flex items-center gap-4">
										<div className="w-8 h-8 rounded-full border-2 border-[#d41120] flex items-center justify-center shrink-0">
											<span className="text-[#d41120] text-sm font-bold font-body">{item.num}</span>
										</div>
										<span className="font-body text-lg font-medium">{item.text}</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
