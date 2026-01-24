import React from 'react'
import useDocumentTitle from '../hooks/useDocumentTitle'
import Hero from '../components/Hero'
import FeaturedCars from '../components/FeaturedCars'
import FeaturedParts from '../components/FeaturedParts'
import RentACarSection from '../components/RentACarSection'
import TowingSection from '../components/TowingSection'
import SellBuySection from '../components/SellBuySection'
import Publicidades from '../components/Publicidades'
import PartnersSlider from '../components/PartnersSlider'

export default function Home() {
	useDocumentTitle('Página Inicial - Caxiauto')

	return (
		<>
			<Hero />
			<main className="max-w-7xl mx-auto p-6">
				<SellBuySection />
				<FeaturedCars title="Carros em Destaque" />
				<div className="my-2">
					<img
						src="./images/ad/publi1.jpg"
						alt="Publicidade"
						className="w-full h-auto rounded-lg shadow-md"
					/>
				</div>
				<RentACarSection />
				<FeaturedCars title="Adicionados Recentemente" />
				<TowingSection />
				<div className="my-2">
					<img
						src="./images/ad/publi3.jpg"
						alt="Publicidade"
						className="w-full h-auto rounded-lg shadow-md"
					/>
				</div>
				<FeaturedParts />
				<Publicidades />
				<PartnersSlider />
				<div className="my-2">
					<img
						src="./images/ad/publi1.jpg"
						alt="Publicidade"
						className="w-full h-auto rounded-lg shadow-md"
					/>
				</div>
			</main>
		</>
	)
}
