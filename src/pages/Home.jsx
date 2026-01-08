import React from 'react'
import useDocumentTitle from '../hooks/useDocumentTitle'
import Hero from '../components/Hero'
import TrustedVehicles from '../components/TrustedVehicles'
import FeaturedCars from '../components/FeaturedCars'
import FeaturedParts from '../components/FeaturedParts'
import CTA from '../components/CTA'
import RentACarSection from '../components/RentACarSection'

export default function Home() {
	useDocumentTitle('Página Inicial - Caxiauto')

	return (
		<>
			<Hero />
			<main className="max-w-7xl mx-auto p-6">
				<TrustedVehicles />
				<RentACarSection />
				<FeaturedCars />
				<FeaturedParts />
				<CTA />
			</main>
		</>
	)
}
