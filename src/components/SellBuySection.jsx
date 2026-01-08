import React from 'react'
import { CheckCircle } from 'lucide-react'

export default function SellBuySection() {
	return (
		<section className="my-4">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Sell Car Card */}
				<div className="bg-[#0055FF] rounded-2xl p-8 py-4 sm:p-12 relative overflow-visible text-white max-h-[300px]">
					<div className="relative z-10 max-w-sm">
						<h2 className="text-2xl md:text-3xl font-bold mb-8 leading-tight">
							Venda o seu carro mais rápido!
						</h2>
						<button className="bg-[#00E676] hover:bg-[#00c865] text-white font-bold px-8 py-3 rounded-lg transition-colors cursor-pointer">
							Saber mais
						</button>
					</div>
					{/* Car Image */}
					<img
						src="/images/FireRed-1-768x528.png.webp"
						alt="Suzuki S-Presso"
						className="absolute bottom-0 right-0 w-2/3 max-w-[300px] md:max-w-[400px] object-contain -translate-x-4 translate-y-5"
					/>
				</div>

				{/* Buy Car Card */}
				<div className="bg-[#1A1C29] rounded-2xl p-8 sm:p-12 text-white max-h-[300px] flex flex-col justify-center">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
						<div>
							<h2 className="text-2xl md:text-3xl font-bold leading-tight mb-2">
								Como comprar
							</h2>
							<h2 className="text-2xl md:text-3xl font-bold leading-tight">
								um carro?
							</h2>
						</div>

						<div className="space-y-6">
							{[
								'Pesquise o carro',
								'Compare viaturas',
								'Adicione aos favoritos',
								'Contacte vendedores',
							].map((item, index) => (
								<div key={index} className="flex items-center gap-4 group">
									<div className="bg-transparent border border-[#00E676] rounded-full p-1 group-hover:bg-[#00E676] transition-colors">
										<CheckCircle className="text-[#00E676] group-hover:text-black w-4 h-4" />
									</div>
									<span className="text-lg font-medium">{item}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
