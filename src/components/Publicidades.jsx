import React, { useState, useEffect } from 'react'

const publicidadesData = [
	{
		id: 1,
		title: 'Oficinas Mecânicas',
		description: 'Manutenção e reparos especializados',
		icon: '🔧',
		bgColor: 'bg-blue-500'
	},
	{
		id: 2,
		title: 'Lavagem Auto',
		description: 'Lavagem completa e detailing',
		icon: '💧',
		bgColor: 'bg-cyan-500'
	},
	{
		id: 3,
		title: 'Polarização',
		description: 'Instalação de películas profissionais',
		icon: '🎨',
		bgColor: 'bg-purple-500'
	},
	{
		id: 4,
		title: 'Pintura Automotiva',
		description: 'Pintura e funilaria de qualidade',
		icon: '🖌️',
		bgColor: 'bg-orange-500'
	},
	{
		id: 5,
		title: 'Pneus e Alinhamento',
		description: 'Serviços de pneus e balanceamento',
		icon: '⚙️',
		bgColor: 'bg-gray-600'
	},
	{
		id: 6,
		title: 'Elétrica Automotiva',
		description: 'Diagnóstico e reparo elétrico',
		icon: '⚡',
		bgColor: 'bg-yellow-500'
	}
]

export default function Publicidades() {
	const [currentIndex, setCurrentIndex] = useState(0)
	const [itemsPerView, setItemsPerView] = useState(4)

	// Atualiza quantidade de itens por visualização baseado no tamanho da tela
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 640) {
				setItemsPerView(1)
			} else if (window.innerWidth < 768) {
				setItemsPerView(2)
			} else if (window.innerWidth < 1024) {
				setItemsPerView(3)
			} else {
				setItemsPerView(4)
			}
		}

		handleResize()
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	// Auto-play do carrossel
	useEffect(() => {
		const interval = setInterval(() => {
			handleNext()
		}, 4000)

		return () => clearInterval(interval)
	}, [currentIndex, itemsPerView])

	const handleNext = () => {
		setCurrentIndex((prevIndex) => {
			const maxIndex = publicidadesData.length - itemsPerView
			return prevIndex >= maxIndex ? 0 : prevIndex + 1
		})
	}

	const handlePrev = () => {
		setCurrentIndex((prevIndex) => {
			const maxIndex = publicidadesData.length - itemsPerView
			return prevIndex <= 0 ? maxIndex : prevIndex - 1
		})
	}

	const goToSlide = (index) => {
		setCurrentIndex(index)
	}

	return (
		<section className="bg-gray-50 mb-4">
			<div className="max-w-7xl mx-auto px-6">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
						Serviços Parceiros
					</h2>
					<p className="text-lg text-gray-600">
						Conectamos você aos melhores profissionais automotivos
					</p>
				</div>

				{/* Carrossel */}
				<div className="relative">
					{/* Botão Anterior */}
					<button
						onClick={handlePrev}
						className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors "
						aria-label="Slide anterior"
					>
						<svg
							className="w-6 h-6 text-gray-800"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 19l-7-7 7-7"
							/>
						</svg>
					</button>

					{/* Container dos Slides */}
					<div className="overflow-hidden">
						<div
							className="flex transition-transform duration-500 ease-out"
							style={{
								transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
							}}
						>
							{publicidadesData.map((item) => (
								<div
									key={item.id}
									className="flex-shrink-0 px-3"
									style={{ width: `${100 / itemsPerView}%` }}
								>
									<div
										className={`${item.bgColor} rounded-lg p-6 h-48 flex flex-col items-center justify-center text-white shadow-lg hover:scale-105 transition-transform cursor-pointer`}
										>
											<div className="text-4xl mb-3">{item.icon}</div>
											<h3 className="text-xl font-bold mb-1 text-center">
												{item.title}
											</h3>
											<p className="text-center text-xs opacity-90">
												{item.description}
											</p>
										</div>
								</div>
							))}
						</div>
					</div>

					{/* Botão Próximo */}
					<button
						onClick={handleNext}
						className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors "
						aria-label="Próximo slide"
					>
						<svg
							className="w-6 h-6 text-gray-800"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</button>
				</div>

				{/* Indicadores */}
				<div className="flex justify-center gap-2 mt-8">
					{Array.from({
						length: Math.max(1, publicidadesData.length - itemsPerView + 1)
					}).map((_, index) => (
						<button
							key={index}
							onClick={() => goToSlide(index)}
							className={`h-2 rounded-full transition-all ${
								currentIndex === index
									? 'w-8 bg-blue-600'
									: 'w-2 bg-gray-300 hover:bg-gray-400'
							}`}
							aria-label={`Ir para slide ${index + 1}`}
						/>
					))}
				</div>
			</div>
		</section>
	)
}
