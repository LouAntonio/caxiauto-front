import React from 'react'
import useDocumentTitle from '../hooks/useDocumentTitle'
import Hero from '../components/Hero'
import FeaturedCars from '../components/FeaturedCars'
import FeaturedParts from '../components/FeaturedParts'
import CTA from '../components/CTA'
import RentACarSection from '../components/RentACarSection'
import TowingSection from '../components/TowingSection'
import SellBuySection from '../components/SellBuySection'
import Publicidades from '../components/Publicidades'

export default function Home() {
	useDocumentTitle('Página Inicial - Caxiauto')

	return (
		<>
			<Hero />
			<main className="max-w-7xl mx-auto p-6">
				<SellBuySection />
				<RentACarSection />
				<FeaturedCars title="Carros em Destaque" />
				<FeaturedCars title="Adicionados Recentemente" />
				<FeaturedParts />
				<TowingSection />
				<Publicidades />
				<CTA />
			</main>
		</>
	)
}
