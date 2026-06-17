import React from 'react'
import { CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function SellBuySection() {
	return (
		<section className="my-4 hidden md:block">
			<div className="max-w-7xl mx-auto px-6 lg:px-8">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="bg-[#154c9a] rounded-2xl p-8 py-4 sm:p-12 relative overflow-visible text-white max-h-[300px]">
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
							className="absolute bottom-0 right-0 w-2/3 max-w-[300px] md:max-w-[400px] object-contain -translate-x-4 translate-y-5"
						/>
					</div>

					<div className="bg-[#111827] rounded-2xl p-8 sm:p-12 text-white max-h-[300px] flex flex-col justify-center">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
							<div>
								<h2 className="font-display text-2xl md:text-3xl font-bold leading-tight mb-2">
								Como comprar
								</h2>
								<h2 className="font-display text-2xl md:text-3xl font-bold leading-tight">
								um carro?
								</h2>
							</div>

							<div className="space-y-6">
								{[
									'Pesquise o carro',
									'Compare opções',
									'Inicie as negociações',
								].map((item, index) => (
									<div key={index} className="flex items-center gap-4 group cursor-pointer">
										<div className="bg-transparent border border-[#d41120] rounded-full p-1 group-hover:bg-[#d41120] transition-colors">
											<CheckCircle className="text-[#d41120] group-hover:text-white w-4 h-4" />
										</div>
										<span className="font-body text-lg font-medium">{item}</span>
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
