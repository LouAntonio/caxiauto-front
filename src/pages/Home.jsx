import React from 'react'
import useDocumentTitle from '../hooks/useDocumentTitle'
import Hero from '../components/Hero'
import FeaturedCars from '../components/FeaturedCars'
import { useRecentVehicles } from '../hooks/queries/useVehicles'
import FeaturedParts from '../components/FeaturedParts'
import RentACarSection from '../components/RentACarSection'
import TowingSection from '../components/TowingSection'
import SellBuySection from '../components/SellBuySection'
import Publicidades from '../components/Publicidades'
import PartnersSlider from '../components/PartnersSlider'
import VehicleRequestSection from '../components/VehicleRequestSection'
import StatsSection from '../components/StatsSection'
import FeedbackSection from '../components/FeedbackSection'

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
				<StatsSection />
				<SellBuySection />
				<FeaturedCars title="Carros em Destaque" />
				<RentACarSection />
				<FeaturedCars title="Adicionados Recentemente" useVehicleQuery={useRecentVehicles} />
				<TowingSection />
				<div className="max-w-7xl mx-auto px-6 lg:px-8 my-8">
					<img
						src="./images/ad/Prancheta 2.png"
						alt="Publicidade"
						className="w-full h-auto rounded-none shadow-lg"
					/>
				</div>
				<FeaturedParts />
				{/* <Publicidades /> */}
				<FeedbackSection />
				<PartnersSlider />
				<div className="max-w-7xl mx-auto px-6 lg:px-8 my-8">
					<img
						src="./images/ad/Prancheta 3.png"
						alt="Publicidade"
						className="w-full h-auto rounded-none shadow-lg"
					/>
				</div>
			</main>
		</>
	)
}
