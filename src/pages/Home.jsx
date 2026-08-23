import React from 'react'
import useDocumentTitle from '../hooks/useDocumentTitle'
import Hero from '../components/Hero'
import FeaturedCars from '../components/FeaturedCars'
import { useFeaturedVehicles } from '../hooks/queries/useVehicles'
import FeaturedParts from '../components/FeaturedParts'
import RentACarSection from '../components/RentACarSection'
import SellBuySection from '../components/SellBuySection'
import PartnersSlider from '../components/PartnersSlider'
import FeedbackSection from '../components/FeedbackSection'

const useRentalVehicles = () => useFeaturedVehicles({ type: 'RENT' })

export default function Home() {
	useDocumentTitle('Página Inicial - Caxiauto')

	return (
		<>
			<Hero />
			<main>
				<div className="max-w-7xl mx-auto px-6 lg:px-8 my-8">
					<img
						src="./images/ad/Prancheta 1.png"
						alt="Publicidade"
						className="w-full h-auto rounded-none shadow-lg"
					/>
				</div>
				<SellBuySection />
				<FeaturedCars title="Carros em Destaque" linkState={{ filters: { destaque: true } }} />
				<RentACarSection />
				<FeaturedCars title="Alugueres em Destaques" useVehicleQuery={useRentalVehicles} linkTo="/servicos/aluguel-de-automoveis" linkState={{ filters: { featured: true } }} />
				<div className="max-w-7xl mx-auto px-6 lg:px-8 my-8">
					<img
						src="./images/ad/Prancheta 2.png"
						alt="Publicidade"
						className="w-full h-auto rounded-none shadow-lg"
					/>
				</div>
				<FeaturedParts linkState={{ filters: { featuredOnly: true } }} />
				<div className="max-w-7xl mx-auto px-6 lg:px-8 my-8">
					<img
						src="./images/ad/Prancheta 3.png"
						alt="Publicidade"
						className="w-full h-auto rounded-none shadow-lg"
					/>
				</div>
				<PartnersSlider />
			</main>
			<FeedbackSection />
		</>
	)
}
